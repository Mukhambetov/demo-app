const Repository = require('./crud');
const knex = require('../db/knex');

const TABLE = 'bikes';
const FIELDS = [
  'bikes.id',
  'bikes.bike_number',
  'bikes.bike_name',
  'bikes.last_known_location',
  'bikes.created_at',
  'bikes.updated_at',
];

const applyFilter = (filter, query) => {
  if (filter) {
    if (filter.status) {
      query.where('status', filter.status);
    }
    if (filter.type) {
      query.where('type', filter.type);
    }
    if (filter.location) {
      query.leftJoin('rentals', function () {
        this.on('bikes.id', 'rentals.bike_id').andOnNull('rentals.end_time');
      })
        .whereRaw('bikes.last_known_location && ST_MakeEnvelope(?, ?, ?, ?, 4326)', [
          filter.location.upperLeftLng,
          filter.location.upperLeftLat,
          filter.location.lowerRightLng,
          filter.location.lowerRightLat,
        ])
        .andWhere(function () {
          this.whereNull('rentals.id').orWhereNotNull('rentals.end_time');
        });
    }
  }
  return query;
};

const extender = (query) => {
  query.select(
    knex.raw('ST_AsGeoJSON(last_known_location)::json as last_known_location'),
  );
  query.leftJoin('bike_types as bt', 'bt.id', 'bikes.bike_type_id')
    .select([
      knex.raw('bt.type'),
    ]);
};

const repository = new Repository(TABLE, FIELDS, applyFilter, extender);

module.exports = repository;
