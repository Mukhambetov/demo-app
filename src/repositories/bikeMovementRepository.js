const Repository = require('./crud');

const TABLE = 'bike_movements';
const FIELDS = [
    'bike_movements.id',
    'bike_movements.bike_id',
    'bike_movements.location',
    'bike_movements.recorded_at',
];

const applyFilter = (filter, query) => {
    if (filter) {
        if (filter.bike_id) {
            query.where('bike_id', filter.bike_id);
        }
        if (filter.from_date) {
            query.where('recorded_at', '>=', filter.from_date);
        }
        if (filter.to_date) {
            query.where('recorded_at', '<=', filter.to_date);
        }
    }
    return query;
};

const repository = new Repository(TABLE, FIELDS, applyFilter);

module.exports = repository;
