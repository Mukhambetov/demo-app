const BaseService = require('./base-service');
const repo = require('../repositories/bikeRepository');

module.exports = new BaseService(repo, 'BIKES');
