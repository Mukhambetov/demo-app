const BaseService = require('./base-service');
const repo = require('../repositories/paymentMethodsRepository');

module.exports = new BaseService(repo, 'PAYMENT METHODS');
