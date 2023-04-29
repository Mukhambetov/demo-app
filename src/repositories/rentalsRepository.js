const Repository = require('./crud');

const TABLE = 'rentals';
const FIELDS = [
    'rentals.id',
    'rentals.bike_id',
    'rentals.user_id',
    'rentals.start_time',
    'rentals.end_time',
    'rentals.start_location',
    'rentals.end_location',
    'rentals.referral_use_id',
    'rentals.promo_code_id',
    'rentals.original_cost',
    'rentals.final_cost',
];

const applyFilter = (filter, query) => {
    if (filter) {
        if (filter.user_id) {
            query.where('user_id', filter.user_id);
        }
        if (filter.bike_id) {
            query.where('bike_id', filter.bike_id);
        }
        if (filter.from_date) {
            query.where('start_time', '>=', filter.from_date);
        }
        if (filter.to_date) {
            query.where('start_time', '<=', filter.to_date);
        }
    }
    return query;
};

const repository = new Repository(TABLE, FIELDS, applyFilter);

module.exports = repository;
