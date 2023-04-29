const logger = require('../helpers/logger');

module.exports = async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    logger.error(err, 'Error middleware');
    ctx.status = err.statusCode || 500;
    if (!err.errorCode) {
      switch (err.statusCode) {
        case 404: {
          err.errorCode = 'RESOURCE_NOT_FOUND';
          break;
        }
        case 403: {
          err.errorCode = 'NO_ACCESS_TO_RESOURCE';
          break;
        }
        case 401: {
          err.errorCode = 'UNAUTHORIZED';
          break;
        }
        case 400: {
          err.errorCode = 'BAD_REQUEST';
          break;
        }
        case 409: {
          err.errorCode = 'CONFLICT';
          break;
        }
        default: {
          if (!err.errorCode) err.errorCode = 'UNKNOWN';
          break;
        }
      }
    }
    if (err.statusCode === 200) {
      ctx.body = {
        status: 'WARN',
        message: err.message,
      };
      ctx.app.emit('error', err, ctx);
      return;
    }
    ctx.body = {
      status: 'ERROR',
      message: err.message,
      ...(err.errorCode && { code: err.errorCode }),
    };
    ctx.app.emit('error', err, ctx);
  }
};
