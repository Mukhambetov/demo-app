const CrudRepository = require('./crud');
const knex = require('../db/knex');

const TABLE = 'insurance_plans';
const FIELDS = [
  'insurance_plans.type',
  'insurance_plans.description',
  'insurance_plans.price',
  'insurance_plans.is_active',
  'insurance_plans.created_at',
  'insurance_plans.updated_at',
];

const applyFilter = (filter, query) => {
  if (filter) {
    if (filter.type) {
      query.where('insurance_plans.type', filter.type);
    }
    if (filter.isActive) {
      query.where('insurance_plans.is_active', filter.isActive);
    }
  }
  return query;
};

const extender = (query) => {
  // Здесь можно добавить дополнительные запросы или операции, если необходимо.
};

const insuranceRepository = new CrudRepository(TABLE, FIELDS, applyFilter, extender);

module.exports = insuranceRepository;
