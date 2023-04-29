const Repository = require('./crud');

const TABLE = 'users';
const FIELDS = [
  'users.id',
  'users.phone',
  'users.name',
];
/**
 *
 * @param filter
 * @param filter.phone {string} - phone contains substring
 * @param query
 * @return {*}
 */
const applyFilter = (filter, query) => {
  if (filter) {
    if (filter.phone) {
      query.where('phone', 'ilike', `%${filter.phone}%`);
    }
    if (filter.name) {
      query.where('name', 'ilike', `%${filter.name}%`);
    }
  }
  return query;
};
const repository = new Repository(TABLE, FIELDS, applyFilter);

module.exports = repository;
