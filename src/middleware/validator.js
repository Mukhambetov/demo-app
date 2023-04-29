const Ajv = require('ajv');
const { throwError } = require('../helpers/error');
const logger = require('../helpers/logger');

module.exports = (schema) => {
  const validator = new Ajv({ coerceTypes: true }).compile(schema);
  return async (ctx, next) => {
    const { body } = ctx.request;
    if (!validator(body)) {
      logger.debug(validator.errors[0], 'Payload validation failed');
      throwError(400, 'AUD-0400', `${validator.errors[0].dataPath} ${validator.errors[0].message}`.trim());
    }
    await next();
  };
};
