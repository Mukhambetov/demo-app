const BaseService = require('./base-service');
const repo = require('../repositories/insurancePlansRepository');

module.exports = new BaseService(repo, 'INSURANCE PLANS');
