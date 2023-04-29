import { config } from './knexfile';
import * as knex from 'knex';

// @ts-ignore
const db = knex(config);

export { db };
