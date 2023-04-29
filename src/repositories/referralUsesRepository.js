const Repository = require('./crud');

const TABLE = 'referral_uses';
const FIELDS = [
    'referral_uses.id',
    'referral_uses.referral_code_id',
    'referral_uses.user_id',
    'referral_uses.redeemed_at',
];

const applyFilter = (filter, query) => {
    if (filter) {
        if (filter.referral_code_id) {
            query.where('referral_code_id', filter.referral_code_id);
        }
        if (filter.user_id) {
            query.where('user_id', filter.user_id);
        }
        if (filter.from_date) {
            query.where('redeemed_at', '>=', filter.from_date);
        }
        if (filter.to_date) {
            query.where('redeemed_at', '<=', filter.to_date);
        }
    }
}

const repository = new Repository(TABLE, FIELDS, applyFilter);

module.exports = repository;
