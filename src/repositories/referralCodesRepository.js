const Repository = require('./crud');
const knex = require('../db/knex');

const TABLE = 'referral_codes';
const FIELDS = [
  'referral_codes.id',
  'referral_codes.code',
  'referral_codes.short_link',
  'referral_codes.reward_amount',
  'referral_codes.created_at',
  'referral_codes.updated_at',
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

const extender = (query) => {
  // Add any extended relationships or custom fields here
};

const repository = new Repository(TABLE, FIELDS, applyFilter, extender);

module.exports = repository;
