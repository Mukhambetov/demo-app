const BaseService = require('./base-service');
const repo = require('../repositories/deviceStatesHistoryRepository');

module.exports = new BaseService(repo, 'DEVICE STATES HISTORY');
