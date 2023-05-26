const path = require('path');
const Koa = require('koa');
const cors = require('@koa/cors');
const Router = require('koa-router');
const bodyParser = require('koa-body');
const jwt = require('koa-jwt');
const { oas } = require('koa-oas3');
const { koaJwtSecret } = require('jwks-rsa');
const logger = require('./helpers/logger');
const { koaLogger } = require('./helpers/logger');
const error = require('./middleware/error');
const user = require('./middleware/user');
const knex = require('./db/knex');

const rootRoutes = require('./routes/root');
const apiRoutes = require('./routes');
const mock = require('./services/mock');

const { FIREBASE_PROJECT_ID, PORT = 8080 } = process.env;

const url = `https://securetoken.google.com/${FIREBASE_PROJECT_ID}/x509`;
const iss = `https://securetoken.google.com/${FIREBASE_PROJECT_ID}`;

module.exports.AppServer = class AppServer {
  constructor() {
    this.app = new Koa();
    this.app.use(koaLogger);
    this.app.use(cors());
    this.app.use(
      bodyParser({
        multipart: true,
        formidable: {
          keepExtensions: true,
        },
      }),
    );
    this.app.use(error);
  }

  async initRoutes() {
    // eslint-disable-next-line no-unused-vars
    const os = await oas({
      file: path.resolve(__dirname, './spec/openapi.yaml'),
      validateResponse: false,
      uiEndpoint: '/openapi.html',
      validatePaths: ['/v1/'],
      validationOptions: {
        requestBodyAjvOptions: {
          allowUnionTypes: true,
          schemaId: 'auto',
          useDefaults: true,
          removeAdditional: true,
          allErrors: true,
          coerceTypes: true,
          jsonPointers: true,
          nullable: true,
        },
        responseBodyAjvOptions: {
          schemaId: 'auto',
          useDefaults: true,
          removeAdditional: true,
          allErrors: true,
          coerceTypes: true,
          jsonPointers: true,
        },
      },
    });
    // this.app.use(os);
    const publicRouter = new Router();
    rootRoutes(publicRouter);
    this.app.use(publicRouter.routes()).use(publicRouter.allowedMethods());

    const privateRouter = new Router({ prefix: '/v1' });
    if (process.env.LOCAL !== 'true') {
      privateRouter.use(jwt({
        debug: true,
        secret: koaJwtSecret({
          jwksUri: url,
          cache: true,
          rateLimit: true,
          jwksRequestsPerMinute: 10,
          cacheMaxEntries: 100,
          cacheMaxAge: 300 * 1000,
        }),
        issuer: iss,
      }));
    }
    privateRouter.use(user);
    apiRoutes(privateRouter);

    this.app.use(privateRouter.routes()).use(privateRouter.allowedMethods());
  }

  start() {
    if (this.appPromise) {
      return this.appPromise;
    }
    process.on('uncaughtException', (err) => {
      logger.fatal(err, 'uncaughtException');
    });
    process.on('unhandledRejection', (err) => {
      logger.fatal(err, 'unhandledRejection');
    });
    process.on('SIGTERM', async () => {
      this.stop();
    });
    process.on('SIGINT', async () => {
      await this.stop();
    });
    this.appPromise = this.initRoutes()
      .then(() => {
        logger.info('Apply migrations');
        return knex.migrate.latest();
      })
      .then(() => {
        logger.info('Apply migrations');
        return knex.seed.run();
      })
      .then(() => new Promise((resolve) => {
        this.app.listen(PORT, () => {
          logger.info('Server started on port %d', PORT);
          resolve(this.app);
        });
      }))
      .then(() => this.app)
      .then(() => {
        // Выполняем функцию каждые 10 секунд (10000 миллисекунд)
        setInterval(mock.insertRandomBikeMovement, 5000);
      });
    return this.appPromise;
  }

  stop() {
    if (this.server) {
      this.server.close((e) => {
        if (e) {
          logger.error(e, 'On server close');
        }
        logger.info('Server stopped');
        process.exit(0);
      });
    } else {
      process.exit(0);
    }
  }

  async callback() {
    const app = await this.appPromise;
    return app.callback();
  }
};
