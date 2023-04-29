module.exports = (service, router, path, id, subPath, subId) => {
  const addService = async (ctx, next) => {
    ctx.service = service;
    await next();
  };
  const list = async (ctx) => {
    const { page = 0, pageSize = 15, ...filter } = ctx.query;
    const nPage = +page;
    const nPageSize = +pageSize;
    const { user } = ctx.state;
    const parentId = ctx.params[id];
    const totalSize = await ctx.service.count(filter, parentId, user);
    const data = await ctx.service.list(filter, parentId, page, pageSize, user);
    ctx.status = 200;
    ctx.body = {
      meta: {
        page: nPage,
        pageSize: nPageSize,
        totalPages: Math.ceil(totalSize / nPageSize),
        totalSize,
      },
      data,
    };
  };
  const get = async (ctx) => {
    const parentId = ctx.params[id];
    const itemId = ctx.params[subId];
    const { user } = ctx.state;
    const data = await ctx.service.get(itemId, parentId, user);
    ctx.status = 200;
    ctx.body = {
      data,
    };
  };
  const create = async (ctx) => {
    const { body } = ctx.request;
    const { user } = ctx.state;
    const parentId = ctx.params[id];
    const data = await ctx.service.create(body, parentId, user);
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
    const parentId = ctx.params[id];
    const itemId = ctx.params[subId];
    const { body } = ctx.request;
    const { user } = ctx.state;
    const data = await ctx.service.update(body, itemId, parentId, user);
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
    const parentId = ctx.params[id];
    const itemId = ctx.params[subId];
    const { user } = ctx.state;
    await ctx.service.del(itemId, parentId, user);
    ctx.status = 204;
  };
  router.get(`/${path}/:${id}/${subPath}/:${subId}`, addService, get);
  router.post(`/${path}/:${id}/${subPath}`, addService, create);
  router.get(`/${path}/:${id}/${subPath}`, addService, list);
  router.put(`/${path}/:${id}/${subPath}/:${subId}`, addService, update);
  router.del(`/${path}/:${id}/${subPath}/:${subId}`, addService, del);
};
