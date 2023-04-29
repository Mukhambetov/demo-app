const debug = require('debug')('STORE:SQL');
const knex = require('../db/knex');
const { deCamelize } = require('../helpers/entity-mapper');

module.exports = class Crud {
  constructor(table, fields, applyFilter, extender) {
    this.TABLE = table;
    this.FIELDS = fields;
    this.applyFilter = applyFilter;
    this.extender = extender;
  }

  list(filter, page = 0, pageSize = 15, props = null) {
    const query = knex(this.TABLE).select(this.FIELDS);
    if (this.applyFilter) {
      this.applyFilter(filter, query);
    }
    if (pageSize > 0) {
      query.offset(page * pageSize).limit(pageSize);
    }
    if (filter && filter.orderBy) {
      const orderCols = filter.orderBy.split(',');
      if (orderCols.length) {
        orderCols.forEach((oc) => {
          const orderArray = oc.trim().split(' ');
          query.orderBy(orderArray[0], orderArray[1]);
        });
      }
    }
    if (this.extender) {
      this.extender(query, props);
    }
    debug(query.toString());
    return query;
  }

  get(id) {
    const query = knex(this.TABLE)
      .select(this.FIELDS)
      .first();
    if (id instanceof Object) {
      query.where(deCamelize(Object.keys(id).reduce((prev, curr) => ({
        [`${this.TABLE}.${curr}`]: id[curr],
        ...prev,
      }), {})));
    } else {
      query.where(deCamelize({ [`${this.TABLE}.id`]: id }));
    }
    if (this.extender) {
      this.extender(query);
    }
    debug(query.toString());
    return query;
  }

  getForUpdate(id, trx) {
    const query = trx.from(this.TABLE)
      .select()
      .first();
    if (id instanceof Object) {
      query.where(deCamelize(Object.keys(id).reduce((prev, curr) => ({
        [`${this.TABLE}.${curr}`]: id[curr],
        ...prev,
      }), {})));
    } else {
      query.where(deCamelize({ [`${this.TABLE}.id`]: id }));
    }
    debug(query.toString());
    return query;
  }

  count(filter) {
    const query = knex(this.TABLE)
      .select(knex.raw('count(1) as count'))
      .first();
    this.applyFilter(filter, query);
    debug(query.toString());
    return query.then((res) => +res.count);
  }

  async create(entity, trx) {
    const query = trx || await knex.transaction();
    try {
      let result;
      if (this.FIELDS && this.FIELDS.length) {
        result = await query.into(this.TABLE)
          .insert(deCamelize(entity))
          .returning(this.FIELDS)
          .then(([res]) => res);
      } else {
        result = await query.into(this.TABLE)
          .insert(deCamelize(entity));
      }
      if (!trx && !query.isCompleted()) {
        await query.commit();
      }
      return result;
    } catch (e) {
      if (!trx && !query.isCompleted()) {
        await query.rollback();
      }
      throw e;
    }
  }

  async update(entity, id, trx) {
    const query = trx || await knex.transaction();
    try {
      let result;
      const q = query.into(this.TABLE)
        .update(deCamelize(entity));
      if (id instanceof Object) {
        q.where(deCamelize(id));
      } else {
        q.where({ id });
      }
      if (this.FIELDS && this.FIELDS.length) {
        result = await q.returning(this.FIELDS).then(([res]) => res);
      } else {
        result = await q;
      }
      if (!trx && !query.isCompleted()) {
        await query.commit();
      }
      return result;
    } catch (e) {
      if (!trx && !query.isCompleted()) {
        await query.rollback();
      }
      throw e;
    }
  }

  async del(id, trx) {
    const query = trx || await knex.transaction();
    try {
      const q = knex(this.TABLE).delete();
      if (id instanceof Object) {
        q.where(deCamelize(id));
      } else {
        q.where(deCamelize({ [`${this.TABLE}.id`]: id }));
      }
      const result = await q;
      if (!trx && !query.isCompleted()) {
        await query.commit();
      }
      return result;
    } catch (e) {
      if (!trx && !query.isCompleted()) {
        await query.rollback();
      }
      throw e;
    }
  }

  async merge(entity, id, conflictColumns, trx) {
    const query = trx || await knex.transaction();
    try {
      let result;
      const q = query.into(this.TABLE)
        .insert(deCamelize(entity))
        .onConflict(conflictColumns)
        .merge();
      if (id instanceof Object) {
        const cid = Object.keys(id).reduce((prev, key) => ({
          ...prev,
          [`${this.TABLE}.${key}`]: id[key],
        }), {});
        q.where(deCamelize(cid));
      } else {
        q.where({ [`${this.TABLE}.id`]: id });
      }
      if (this.FIELDS && this.FIELDS.length) {
        result = await q.returning(this.FIELDS).then(([res]) => res);
      } else {
        result = await q;
      }
      if (!trx && !query.isCompleted()) {
        await query.commit();
      }
      return result;
    } catch (e) {
      if (!trx && !query.isCompleted()) {
        await query.rollback();
      }
      throw e;
    }
  }
};
