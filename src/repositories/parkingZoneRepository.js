const Repository = require('./crud');

const TABLE = 'parking_zones';
const FIELDS = [
    'parking_zones.id',
    'parking_zones.name',
    'parking_zones.zone',
];

const applyFilter = (filter, query) => {
    if (filter) {
        if (filter.name) {
            query.where('name', 'ilike', `%${filter.name}%`);
        }
    }
    return query;
};

const repository = new Repository(TABLE, FIELDS, applyFilter);

module.exports = repository;
