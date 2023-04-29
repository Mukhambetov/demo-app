const { join } = require('path');
const { camelize } = require('../helpers/entity-mapper');

module.exports = {
  client: 'pg',
  connection: {
    host: process.env.DB_URL,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 5432,
    timezone: process.env.DB_TIMEZONE || 'Asia/Almaty',
  },
  pool: {
    min: 2,
    max: 10,
    idleTimeoutMillis: 30000,
  },
  migrations: {
    directory: join(__dirname, './migrations'),
    tableName: 'knex_migrations',
  },
  seeds: {
    directory: join(__dirname, './seeds'),
  },
  postProcessResponse: (result) => {
    // TODO: add special case for raw results (depends on dialect)
    if (!result) {
      return result;
    }
    if (Array.isArray(result)) {
      return camelize(result.map((row) => Object.keys(row)
        .filter((k) => row[k] != null)
        .reduce((a, k) => ({ ...a, [k]: row[k] }), {})));
    }
    return camelize(Object.keys(result)
      .filter((k) => result[k] != null)
      .reduce((a, k) => ({ ...a, [k]: result[k] }), {}));
  },
};
