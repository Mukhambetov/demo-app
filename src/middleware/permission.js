const { replace } = require('lodash');
const { throwError } = require('../helpers/error');
const validate = require('../helpers/permission-mapper');
const logger = require('../helpers/logger');

module.exports = async (ctx, next) => {
  if (process.env.LOCAL === 'true') {
    await next();
  } else {
    const { permissions } = ctx.state.user;
    const { originalUrl } = ctx;
    const { method: reqMethod } = ctx.request.req;
    const permission = permissions.find((route) => {
      try {
        const [method, path] = route.name.split(':');
        const pattern = replace(replace(path, /\//g, '\\/'), /\*/g, '[A-z-\\d]*');
        const regex = new RegExp(`^${pattern}$`);
        return regex.test(originalUrl.replace(/\?.*/, '')) && method === reqMethod;
      } catch (e) {
        logger.error(e);
        return false;
      }
    });
    if (permission) {
      if (permissions.schema) {
        ctx.request.body = validate(ctx.request.body, permissions.schema);
      }
      await next();
      if (permission.respSchema) {
        ctx.body = validate(ctx.body, permission.respSchema);
      }
    } else {
      throwError(403, 'ERROR', 'Forbidden');
    }
  }
};
