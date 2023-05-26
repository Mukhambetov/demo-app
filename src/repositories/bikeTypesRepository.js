// bike_types.js
const Repository = require('./crud');
const knex = require('../db/knex');

const TABLE = 'bike_types';
const FIELDS = [
  'bike_types.id',
  'bike_types.name',
  'bike_types.type',
  'bike_types.is_active',
  'bike_types.created_at',
  'bike_types.updated_at',
];

const applyFilter = (filter, query) => {
  if (filter) {
    if (filter.id) {
      query.where('id', filter.id);
    }
    if (filter.type) {
      query.where('type', 'ilike', `%${filter.type}%`);
    }
    if (filter.isActive) {
      query.where('bike_types.is_active', filter.isActive);
    }
  }
  return query;
};

const extender = (query) => {
  // Add any extended relationships or custom fields here
};

const repository = new Repository(TABLE, FIELDS, applyFilter, extender);

module.exports = repository;
