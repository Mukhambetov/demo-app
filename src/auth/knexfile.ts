import * as knex from 'knex';

// @ts-ignore
export const config: knex.Config = {
  client: 'postgresql',
  connection: {
    host: process.env.DB_URL,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  },
  pool: {
    min: 2,
    max: 10,
    idleTimeoutMillis: 30000,
  }
};
