const BaseService = require('./base-service');
const repo = require('../repositories/ridingZonesRepository');

module.exports = new BaseService(repo, 'PARKING ZONES');
