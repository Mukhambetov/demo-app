const logger = require('../helpers/logger');
const { throwError, errors } = require('../helpers/error');

module.exports = class BaseService {
  constructor(
    repository,
    context,
  ) {
    this.repository = repository;
    this.context = context;
  }

  list(filter, parentId, page, pageSize, user) {
    logger.debug({ filter, parentId, user }, `List of ${this.context}`);
    return this.repository.list(
      { ...filter, ...parentId },
      page,
      pageSize,
    );
  }

  count(filter, parentId, user) {
    logger.debug({ filter, parentId, user }, `List of ${this.context}`);
    return this.repository
      .count({ ...filter, ...parentId });
  }

  create(entity, parentId, user) {
    logger.debug({ user, entity }, `Create ${this.context}`);
    return this.repository.create({ ...entity, ...parentId });
  }

  async get(id, parentId, user) {
    logger.debug({ user, id, parentId }, `Get ${this.context}`);
    const entry = await this.repository.get(
      {
        ...id,
        ...parentId,
      },
    );
    if (!entry) {
      throwError(404, errors.NOT_FOUND);
    }
    return entry;
  }

  update(entity, id, parentId, user) {
    logger.debug({ user, entity, id }, `Update ${this.context}`);
    return this.repository.update(entity, { ...id, ...parentId });
  }

  async del(id, parentId, user) {
    logger.debug({ user, id }, `delete ${this.context}`);
    const entry = await this.repository.get({
      ...id,
      ...parentId,
    });
    if (!entry) {
      throwError(404, errors.NOT_FOUND);
    }
    return this.repository.update({
      isActive: false,
    }, { ...id, ...parentId });
  }
};
