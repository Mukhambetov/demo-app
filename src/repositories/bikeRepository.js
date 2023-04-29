const Repository = require('./crud');
const knex = require("../db/knex");

const TABLE = 'bikes';
const FIELDS = [
    'bikes.id',
    'bikes.status',
    'bikes.type',
    'bikes.last_known_location',
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
                    location.upperLeftLng,
                    location.upperLeftLat,
                    location.lowerRightLng,
                    location.lowerRightLat
                ])
                .andWhere(function () {
                    this.whereNull('rentals.id').orWhereNotNull('rentals.end_time');
                });
        }
    }
    return query;
};

const repository = new Repository(TABLE, FIELDS, applyFilter);

module.exports = repository;
