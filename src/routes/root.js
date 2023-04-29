module.exports = (router) => {
  router.get('/', async (ctx) => {
    ctx.status = 200;
    ctx.body = {
      status: 'SUCCESS',
    };
  });
};
