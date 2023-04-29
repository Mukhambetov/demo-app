const Repository = require('./crud');

const TABLE = 'riding_zones';
const FIELDS = [
    'riding_zones.id',
    'riding_zones.name',
    'riding_zones.zone',
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
