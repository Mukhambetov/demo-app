const Repository = require('./crud');

const TABLE = 'tariffs';
const FIELDS = [
    'tariffs.id',
    'tariffs.bike_type',
    'tariffs.minutes',
    'tariffs.cost',
    'tariffs.is_active',
];

const applyFilter = (filter, query) => {
    if (filter) {
        if (filter.bike_type) {
            query.where('bike_type', filter.bike_type);
        }
        if (filter.is_active) {
            query.where('is_active', filter.is_active);
        }
    }
    return query;
};

const repository = new Repository(TABLE, FIELDS, applyFilter);

module.exports = repository;
