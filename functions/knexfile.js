const { join } = require('path');
const functions = require('firebase-functions');
const { camelize } = require('../src/helpers/entity-mapper');

const {
  db_url, db_username, db_password, db_name, db_port, db_timezone,
} = functions.config().loop;

module.exports = {
  client: 'pg',
  connection: {
    host: db_url,
    user: db_username,
    password: db_password,
    database: db_name,
    port: db_port || 5432,
    timezone: db_timezone || 'Asia/Almaty',
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
