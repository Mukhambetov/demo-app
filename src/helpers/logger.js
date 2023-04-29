const pino = require('pino');
const koaPino = require('koa-pino-logger');

const { APPLICATION } = process.env || 'Application';

const slowTime = () => `,"time":"${new Date().toISOString()}"`;

const logLevelMap = {
  10: 'TRACE',
  20: 'DEBUG',
  30: 'INFO',
  40: 'WARN',
  50: 'ERROR',
  60: 'FATAL',
};

const customSerializer = {
  req: (req) => {
    const logObject = {};
    if (req.method) logObject.method = req.method;
    if (req.url) logObject.url = req.url;
    if (req.headers['user-agent']) logObject['user-agent'] = req.headers['user-agent'];
    return logObject;
  },
};

const logOutput = {
  [Symbol.for('needsMetadata')]: true,
  write(chunk) {
    let log;
    Object.keys(logLevelMap).every((level) => {
      if (chunk.includes(`"level":${level}`)) {
        log = chunk.replace(`"level":${level}`, `"level":"${logLevelMap[level]}"`);
        return false;
      }
      return true;
    });
    process.stdout.write(log);
  },
};
const options = {
  base: {
    application: APPLICATION,
  },
  level: process.env.LOG_LEVEL || 'trace',
  timestamp: slowTime,
};

const optionsKoa = {
  base: {
    application: APPLICATION,
  },
  level: process.env.LOG_LEVEL || 'trace',
  timestamp: slowTime,
  serializers: customSerializer,
  autoLogging: {
    ignorePaths: [
      '/',
    ],
  },
};

const logger = pino(options, logOutput);
const koaLogger = koaPino(optionsKoa, logOutput);

module.exports = logger;
module.exports.koaLogger = koaLogger;
