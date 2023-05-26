const Repository = require('./crud');
const knex = require('../db/knex');

const TABLE = 'device_states_history';
const FIELDS = [
  'device_states_history.device_name',
  'device_states_history.is_locked',
  'device_states_history.location',
  'device_states_history.altitude',
  'device_states_history.payload',
  'device_states_history.created_at',
];

const applyFilter = (filter, query) =>
  // Add filters as needed
  query;
const extender = (query) => {
  // Add any extended relationships or custom fields here
};

const repository = new Repository(TABLE, FIELDS, applyFilter, extender);

module.exports = repository;
