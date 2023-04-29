FROM node:18-alpine

ENV SOURCES /app

RUN apk add --update --no-cache bash git

RUN mkdir -p ${SOURCES} && chown -R node:node ${SOURCES}

ENV NODE_OPTIONS="--max-old-space-size=8192"

WORKDIR ${SOURCES}

EXPOSE 8080

COPY . ${SOURCES}

RUN npm ci --omit=dev --legacy-peer-deps

RUN npm install typescript @nestjs/cli -g

RUN npm run build

CMD npm run start:prod
