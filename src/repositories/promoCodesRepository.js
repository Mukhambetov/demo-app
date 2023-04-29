const Repository = require('./crud');

const TABLE = 'promo_codes';
const FIELDS = [
    'promo_codes.id',
    'promo_codes.code',
    'promo_codes.discount_type',
    'promo_codes.discount_value',
    'promo_codes.start_time',
    'promo_codes.end_time',
];

const applyFilter = (filter, query) => {
    if (filter) {
        if (filter.code) {
            query.where('code', 'ilike', `%${filter.code}%`);
        }
        if (filter.discount_type) {
            query.where('discount_type', filter.discount_type);
        }
    }
    return query;
};

const repository = new Repository(TABLE, FIELDS, applyFilter);

module.exports = repository;
