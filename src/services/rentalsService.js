const BaseService = require('./base-service');
const repo = require('../repositories/rentalsRepository');

module.exports = new BaseService(repo, 'RENTALS');
