const { AppServer } = require('./server');
const { version } = require('../package.json');

const logger = require('./helpers/logger');

logger.info('Version %s', version);
const app = new AppServer();
app.start();

process.on('uncaughtException', (err) => {
  logger.fatal(err, 'uncaughtException');
});
process.on('unhandledRejection', (err) => {
  logger.fatal(err, 'unhandledRejection');
});
process.on('SIGTERM', async () => {
  logger.info('SIGTERM stop');
  app.stop();
});
process.on('SIGINT', async () => {
  logger.info('SIGINT stop');
  await app.stop();
});
module.exports = app;
