const Repository = require('./crud');

const TABLE = 'referral_codes';
const FIELDS = [
    'referral_codes.id',
    'referral_codes.code',
    'referral_codes.user_id',
    'referral_codes.reward_amount',
];

const applyFilter = (filter, query) => {
    if (filter) {
        if (filter.code) {
            query.where('code', 'ilike', `%${filter.code}%`);
        }
        if (filter.user_id) {
            query.where('user_id', filter.user_id);
        }
    }
    return query;
};

const repository = new Repository(TABLE, FIELDS, applyFilter);

module.exports = repository;
