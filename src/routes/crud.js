module.exports = (service, router, path, id) => {
  const addService = async (ctx, next) => {
    ctx.service = service;
    await next();
  };
  const list = async (ctx) => {
    const { page = 0, pageSize = 15, ...filter } = ctx.query;
    const nPage = +page;
    const nPageSize = +pageSize;
    const { user } = ctx.state;
    const totalSize = await ctx.service.count(filter, user);
    const data = await ctx.service.list(filter, page, pageSize, user);
    ctx.status = 200;
    ctx.body = {
      status: 'SUCCESS',
      meta: {
        page: nPage,
        pageSize: nPageSize,
        totalPages: Math.ceil(totalSize / nPageSize),
        totalSize: +totalSize,
      },
      data,
    };
  };
  const get = async (ctx) => {
    const itemId = ctx.params[id];
    const { user } = ctx.state;
    const data = await ctx.service.get(itemId, user);
    ctx.status = 200;
    ctx.body = {
      data,
    };
  };
  const create = async (ctx) => {
    const { body } = ctx.request;
    const { user } = ctx.state;
    const data = await ctx.service.create(body, user);
    if (data) {
      ctx.status = 200;
      ctx.body = {
        data,
      };
    } else {
      ctx.status = 204;
    }
  };
  const update = async (ctx) => {
    const itemId = ctx.params[id];
    const { body } = ctx.request;
    const { user } = ctx.state;
    const data = await ctx.service.update(body, itemId, user);
    if (data) {
      ctx.status = 200;
      ctx.body = {
        data,
      };
    } else {
      ctx.status = 204;
    }
  };
  const del = async (ctx) => {
    const itemId = ctx.params[id];
    const { user } = ctx.state;
    await ctx.service.del(itemId, user);
    ctx.status = 204;
  };
  router.get(`/${path}`, addService, list);
  router.get(`/${path}/:${id}`, addService, get);
  router.post(`/${path}`, addService, create);
  router.put(`/${path}/:${id}`, addService, update);
  router.del(`/${path}/:${id}`, addService, del);
};
