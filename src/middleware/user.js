const NodeCache = require('node-cache');
const repository = require('../repositories/usersRepository');
const { throwError } = require('../helpers/error');

const cache = new NodeCache();

module.exports = async (ctx, next) => {
  let user = {
    id: '842a747d-8b53-4465-9d4c-fd163d9c470c',
  };
  if (process.env.LOCAL === 'true') {
    ctx.state = {
      user,
    };
  } else {
    ctx.state.user.id = ctx.state.user.sub;
  }
  ctx.state.user.id = user.id;
  await next();
};
