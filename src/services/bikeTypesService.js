const BaseService = require('./base-service');
const repo = require('../repositories/bikeTypesRepository');

module.exports = new BaseService(repo, 'BIKE TYPES');
