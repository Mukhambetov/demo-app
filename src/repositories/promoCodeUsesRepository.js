const Repository = require('./crud');
const knex = require('../db/knex');

const TABLE = 'promo_code_uses';
const FIELDS = [
  'promo_code_uses.id',
  'promo_code_uses.promo_code_id',
  'promo_code_uses.user_id',
  'promo_code_uses.rental_id',
  'promo_code_uses.used_at',
];

const applyFilter = (filter, query) => {
  if (filter) {
    if (filter.userId) {
      query.where('promo_code_uses.user_id', filter.userId);
    }
    if (filter.promoCodeId) {
      query.where('promo_code_uses.promo_code_id', filter.promoCodeId);
    }
    if (filter.rentalId) {
      query.where('promo_code_uses.rental_id', filter.rentalId);
    }
  }
  // Add filters as needed
  return query;
};

const extender = (query) => {
  // Add any extended relationships or custom fields here
};

const repository = new Repository(TABLE, FIELDS, applyFilter, extender);

module.exports = repository;
