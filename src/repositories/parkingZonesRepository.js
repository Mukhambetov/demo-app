const Repository = require('./crud');
const knex = require('../db/knex');

const TABLE = 'parking_zones';
const FIELDS = [
  'parking_zones.id',
  'parking_zones.name',
  'parking_zones.is_active',
];

const applyFilter = (filter, query) => {
  if (filter) {
    if (filter.name) {
      query.where('parking_zones.name', 'ilike', `%${filter.name}%`);
    }
    if (filter.isActive) {
      query.where('parking_zones.is_active', filter.isActive);
    }
  }
  return query;
};

const extender = (query, pros) => {
  query.select([
    knex.raw('ST_AsGeoJSON(parking_zones.zone)::json as geometry'),
  ]);
};

const repository = new Repository(TABLE, FIELDS, applyFilter, extender);

module.exports = repository;
