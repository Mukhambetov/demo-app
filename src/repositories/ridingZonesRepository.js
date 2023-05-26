const Repository = require('./crud');
const knex = require('../db/knex');

const TABLE = 'riding_zones';
const FIELDS = [
  'riding_zones.id',
  'riding_zones.name',
  'riding_zones.is_active',
];

/**
 * @param filter {Object}
 * @param query {Knex.QueryBuilder}
 * @return {*}
 */
const applyFilter = (filter, query) => {
  if (filter) {
    if (filter.name) {
      query.where('riding_zones.name', 'ilike', `%${filter.name}%`);
    }
    if (filter.isActive) {
      query.where('riding_zones.is_active', filter.isActive);
    }
    if (filter.bounds) {
      const params = filter.bounds.map((str) => str.split(','))
        .reduce((acc, curr) => acc.concat(...curr), []);
      query.where(
        knex.raw('ST_Intersects("riding_zones"."zone", ST_MakeEnvelope(?, ?, ?, ?, 4326))', params),
      );
    }
  }
  console.log(query.toQuery());
  return query;
};

const extender = (query, pros) => {
  query.select([
    knex.raw('ST_AsGeoJSON(riding_zones.zone)::json as geometry'),
  ]);
};

const repository = new Repository(TABLE, FIELDS, applyFilter, extender);

module.exports = repository;
