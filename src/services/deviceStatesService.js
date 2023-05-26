const BaseService = require('./base-service');
const repo = require('../repositories/deviceStatesRepository');

module.exports = new BaseService(repo, 'DEVICE STATES');
