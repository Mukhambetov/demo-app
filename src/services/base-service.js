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

  list(filter, page, pageSize, user) {
    logger.debug({ filter, user }, `List of ${this.context}`);
    return this.repository.list({ ...filter }, page, pageSize);
  }

  count(filter, user) {
    logger.debug({ filter, user }, `List of ${this.context}`);
    return this.repository
      .count({ ...filter });
  }

  create(entity, user) {
    logger.debug({ user, entity }, `Create ${this.context}`);
    return this.repository.create({ ...entity });
  }

  async get(id, user) {
    logger.debug({ user, id }, `Get ${this.context}`);
    let entry = null;
    if (id instanceof Object) {
      entry = await this.repository.get(id);
    } else {
      entry = await this.repository.get({ id });
    }
    if (!entry) {
      throwError(404, errors.NOT_FOUND);
    }
    return entry;
  }

  update(entity, id, user) {
    logger.debug({ user, entity, id }, `Update ${this.context}`);
    return this.repository.update(entity, { id });
  }

  async del(id, user, _options) {
    logger.debug({ user, id, _options }, `delete ${this.context}`);
    let entry;
    if (id instanceof Object) {
      entry = await this.repository.get(id);
    } else {
      entry = await this.repository.get({ id });
    }

    if (!entry) {
      throwError(404, errors.NOT_FOUND);
    }
    return this.repository.update({
      removedAt: new Date(),
      removedBy: user.id,
      isActive: false,
    }, id);
  }
};
