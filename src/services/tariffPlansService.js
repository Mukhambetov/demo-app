const BaseService = require('./base-service');
const repo = require('../repositories/tariffsRepository');

module.exports = new BaseService(repo, 'TARIFF PLANS');
