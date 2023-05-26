const Repository = require('./crud');
const knex = require('../db/knex');

const TABLE = 'promo_codes';
const FIELDS = [
  'promo_codes.id',
  'promo_codes.code',
  'promo_codes.discount_type',
  'promo_codes.discount_value',
  'promo_codes.start_time',
  'promo_codes.end_time',
  'promo_codes.is_active',
  'promo_codes.created_at',
  'promo_codes.updated_at',
];

const applyFilter = (filter, query) => {
  // Add filters as needed
  if (filter) {
    if (filter.code) {
      query.where(`${TABLE}.code`, filter.code);
    }
    if (filter.isActive) {
      query.where(`${TABLE}.is_active`, filter.isActive);
    }
    if (filter.startTime) {
      query.where(`${TABLE}.start_time`, new Date(filter.startTime).toISOString());
    } else {
      query.where(`${TABLE}.start_time`, '<', knex.raw('now()'));
    }
    if (filter.endTime) {
      query.where(`${TABLE}.end_time`, new Date(filter.endTime).toISOString());
    } else {
      query.where(`${TABLE}.end_time`, '>', knex.raw('now()'));
    }
  }
};
const extender = (query) => {
  // Add any extended relationships or custom fields here
};

const repository = new Repository(TABLE, FIELDS, applyFilter, extender);

module.exports = repository;
