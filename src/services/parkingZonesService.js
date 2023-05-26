const BaseService = require('./base-service');
const repo = require('../repositories/parkingZonesRepository');

module.exports = new BaseService(repo, 'PARKING ZONES');
