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
    if (filter.userId) {
      query.where('user_id', filter.userId);
    }
    if (filter.bikeId) {
      query.where('bike_id', filter.bikeId);
    }
    if (filter.fromDate) {
      query.where('start_time', '>=', filter.fromDate);
    }
    if (filter.toDate) {
      query.where('start_time', '<=', filter.toDate);
    }
  }
  return query;
};

const repository = new Repository(TABLE, FIELDS, applyFilter);

module.exports = repository;
