const Repository = require('./crud');

const TABLE = 'referral_uses';
const FIELDS = [
  'referral_uses.id',
  'referral_uses.referral_code_id',
  'referral_uses.user_id',
  'referral_uses.rental_id',
  'referral_uses.redeemed_at',
];

/**
 * @param filter {Object}
 * @param query {Knex}
 */
const applyFilter = (filter, query) => {
  if (filter) {
    if (filter.referralCodeId) {
      query.where('referral_code_id', filter.referralCodeId);
    }
    if (filter.userId) {
      query.where('user_id', filter.userId);
    }
    if (filter.fromDate) {
      query.where('redeemed_at', '>=', filter.fromDate);
    }
    if (filter.toDate) {
      query.where('redeemed_at', '<=', filter.toDate);
    }
  }
};

const repository = new Repository(TABLE, FIELDS, applyFilter);

module.exports = repository;
