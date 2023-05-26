const Repository = require('./crud');
const knex = require('../db/knex');

const TABLE = 'device_states';
const FIELDS = [
  'device_states.device_name',
  'device_states.is_locked',
  'device_states.location',
  'device_states.altitude',
  'device_states.payload',
  'device_states.created_at',
];

const applyFilter = (filter, query) =>
  // Add filters as needed
  query;
const extender = (query) => {
  // Add any extended relationships or custom fields here
};

const repository = new Repository(TABLE, FIELDS, applyFilter, extender);

module.exports = repository;
