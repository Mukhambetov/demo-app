const Repository = require('./crud');
const knex = require("../db/knex");

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

const extender = (query) => {
  query.leftJoin('referral_codes as rc', 'rc.user_id', 'users.id')
      .leftJoin('referral_uses as ru', 'ru.referral_code_id', 'rc.id')

  query.select([
      knex.raw('CASE WHEN rc IS NOT NULL THEN row_to_json(rc) END as referral_code'),
      knex.raw('COALESCE(json_agg(ru) FILTER (WHERE ru.id IS NOT NULL), \'[]\') as referral_uses'),
      ]);
  query.groupBy([
    "users.id", "users.phone", "users.name", 'rc'
  ])
}

const repository = new Repository(TABLE, FIELDS, applyFilter, extender);

module.exports = repository;
