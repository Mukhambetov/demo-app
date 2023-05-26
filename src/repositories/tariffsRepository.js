const Repository = require('./crud');
const knex = require('../db/knex');

const TABLE = 'tariff_plans';
const FIELDS = [
  'tariff_plans.id',
  'tariff_plans.bike_type_id',
  'tariff_plans.tier',
  'tariff_plans.start_time',
  'tariff_plans.end_time',
  'tariff_plans.cost',
  'tariff_plans.is_minute_rate',
  'tariff_plans.is_active',
  'tariff_plans.created_at',
  'tariff_plans.updated_at',
];

/**
 * @param filter {{bikeTypeId: string, isActive: boolean}}
 * @param query
 * @return {*}
 */
const applyFilter = (filter, query) => {
  if (filter) {
    if (filter.bikeTypeId) {
      query.where(`${TABLE}.bike_type_id`, filter.bikeTypeId);
    }
  }
  if (filter && filter.isActive) {
    query.where('is_active', filter.isActive);
  } else {
    query.where('is_active', true);
  }
  return query;
};

const repository = new Repository(TABLE, FIELDS, applyFilter);

module.exports = repository;
