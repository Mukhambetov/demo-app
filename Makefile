include .env.dev
AWS_ENVS = AWS_ACCESS_KEY_ID AWS_SECRET_ACCESS_KEY AWS_STAGE AWS_REGION AWS_DEFAULT_REGION
DOCKER_REPO= $(shell AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID} AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY} aws cloudformation --region ${AWS_REGION}  describe-stacks --stack-name $(CONTEXT)-${AWS_STAGE}-permanent | \
         	jq -r '.Stacks[0].Outputs[] | select(.OutputKey == "DockerImage").OutputValue')
CONTEXT = maybebaby
COMMIT_VERSION = $(shell git rev-parse --short HEAD)
OUTPUT = ''
DOCKER_REPO_INITIAL=010942841761.dkr.ecr.us-east-1.amazonaws.com/$(CONTEXT)-${AWS_STAGE}
ACCOUNT_ID= $(shell AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID} AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY} aws sts get-caller-identity | jq -r ".Account")
CURR_DIR=$(shell pwd)
all:
	@echo "Available targets:"
	@echo "  * update-stack			- Updates stack"
	@echo "  * print-stack			- Print stack yaml"
	@echo "  * update-permanent		- Updates permanent stack"
	@echo "  * remove-stack			- Remove stack"

.EXPORT_ALL_VARIABLES:
	CONTEXT = ${CONTEXT}

.PHONY: check-env-%
check-env-%:
	@ if [ "${${*}}" = "" ]; then \
			echo "Environment variable $* not set"; \
			exit 1; \
		fi


check-aws-env: $(addprefix check-env-,$(AWS_ENVS))

check-dependencies:
	@aws --version
	@jq --version
	@yq --version
	@./node_modules/.bin/sls --version

merge-stack:
	 @$(shell cd ./config/additional-stack/templates/ && touch ../additional-stacks.${AWS_STAGE}.merged.yml && yq eval-all 'select(fileIndex == 0) * select(fileIndex == 1) * select(fileIndex == 2) * select(fileIndex == 3) * select(fileIndex == 4) * select(fileIndex == 5) * select(fileIndex == 6) * select(fileIndex == 7)' $$(ls) > ../additional-stacks.${AWS_STAGE}.merged.yml)
# 	 @$(shell cd ./config/additional-stack/templates/ && touch ../additional-stacks.${AWS_STAGE}.merged.yml && yq m $$(ls) > ../additional-stacks.${AWS_STAGE}.merged.yml)
	 @echo ">> Additional stacks merged"

dev:
	@echo ">> starting all services"
	@docker-compose up --build --remove-orphans -d
	@docker-compose ps
#	@echo ">> creating bucket"
#	@sleep 10
#	@aws --endpoint-url=http://localhost:4572 s3 mb s3://${S3_BUCKET}
#	@sleep 1
#	@aws --endpoint-url=http://localhost:4572 s3api put-bucket-acl --bucket ${S3_BUCKET} --acl public-read

clean:
	@echo ">> Cleanup docker dependencies"
	@docker-compose down --remove-orphans --volumes

.PHONY: update-stack
update-stack: check-aws-env merge-stack
	@echo ">> Updating stack"
	@node --max-old-space-size=4096 ./node_modules/serverless/bin/serverless deploy -s ${AWS_STAGE} -r ${AWS_REGION}

.PHONY: print-stack
print-stack: check-aws-env merge-stack
	@echo ">> Print stack"
	@./node_modules/.bin/sls print -s ${AWS_STAGE} -r ${AWS_REGION}

.PHONY: update-permanent
update-permanent: check-aws-env merge-stack
	@echo ">> Updating permanent stack"
	@./node_modules/.bin/sls deploy -s ${AWS_STAGE} -r ${AWS_REGION} additionalstacks --stack permanent

.PHONY: remove-stack
remove-stack: check-aws-env merge-stack
	@echo ">> Removing stack"
	@./node_modules/.bin/sls remove -s ${AWS_STAGE} -r ${AWS_REGION}

.PHONY: remove_check
remove_check:
	@(read -p "Are you sure? [y/N]: " sure && case "$$sure" in [yY]) true;; *) false;; esac )

.PHONY: remove
remove: remove_check
	@./node_modules/.bin/sls remove

prepublish:
	@echo "Checking if all rquired dependencies are present:"
	@aws --version
	@docker version

docker:
	@echo ">> Building docker image for $*"
	docker build -t "$(DOCKER_REPO):$(COMMIT_VERSION)" -t "$(DOCKER_REPO):latest" -f Dockerfile .

docker-registry-login:
ifeq (,$(shell grep -s "${DOCKER_REPO}" "${HOME}/.docker/config.json"))
	@echo ">> Logging in to docker registry "
	@aws ecr get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin $(ACCOUNT_ID).dkr.ecr.${AWS_REGION}.amazonaws.com
else
	@echo ">> Already logged in docker registry..."
endif

create-repository:
	aws ecr create-repository --repository-name $(CONTEXT)

.PHONY: publish
publish: prepublish docker docker-registry-login
	@echo ">> Publishing docker image"
	@echo ">> $(DOCKER_REPO)/$(CONTEXT):$(COMMIT_VERSION)"
	@docker push "$(DOCKER_REPO):$(COMMIT_VERSION)"
	@docker push "$(DOCKER_REPO):latest"

update: publish
	aws ecs update-service --cluster $(CONTEXT)-Cluster --service $(CONTEXT)-Service --force-new-deployment

update-dev: publish
	aws ecs update-service --cluster $(CONTEXT)-dev-Cluster --service $(CONTEXT)-dev-Service --force-new-deployment


local-run:
	@echo ">> starting all services"
	@docker-compose up --build --remove-orphans -d
	@sleep 5
	@node -r dotenv/config ./test/.env ./node_modules/.bin/knex --knexfile ./src/db/knexfile.js migrate:latest
	@node -r dotenv/config ./test/.env ./node_modules/.bin/knex --knexfile ./src/db/knexfile.js seed:run
	@docker-compose ps

local-migrate:
	@node -r dotenv/config ./node_modules/.bin/knex -- knexfile ./src/db/knexfile.js migrate:latest
	@node -r dotenv/config ./node_modules/.bin/knex --knexfile ./src/db/knexfile.js seed:run
local-clean:
	@echo ">> Cleanup docker dependencies"
	@docker-compose down --remove-orphans --volumes

.PHONY: function-update-%
function-update-%: check-aws-env merge-stack
	@./node_modules/.bin/sls deploy -s ${AWS_STAGE} -r ${AWS_REGION} function --function $*

describe:
	aws elb describe-load-balancers


.PHONY: test
test:
	@node ./node_modules/.bin/eslint ./src --fix
	@LOCAL=true DOTENV_CONFIG_PATH=$(CURR_DIR)/test/.env node -r dotenv/config ./node_modules/mocha/bin/mocha --exit $(CURR_DIR)/test/04-api/ --recursive
