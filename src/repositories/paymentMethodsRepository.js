const Repository = require('./crud');

const TABLE = 'payment_methods';
const FIELDS = [
  'payment_methods.id',
  'payment_methods.user_id',
  'payment_methods.card_brand',
  'payment_methods.card_number',
  'payment_methods.exp_month',
  'payment_methods.exp_year',
  'payment_methods.cvv',
  'payment_methods.is_default',
  'payment_methods.is_active',
  'payment_methods.created_at',
  'payment_methods.updated_at',
];
const applyFilter = (filter, query) => {
  if (filter) {
    if (filter.userId) {
      query.where(`${TABLE}.user_id`, filter.userId);
    }
    if (filter.isDefault) {
      query.where(`${TABLE}.is_default`, filter.isDefault);
    }
    if (filter.isActive) {
      query.where(`${TABLE}.is_active`, filter.isActive);
    }
  }
  return query;
};

const repository = new Repository(TABLE, FIELDS, applyFilter);

module.exports = repository;
