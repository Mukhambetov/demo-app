const BaseService = require('./base-service');
const repo = require('../repositories/promoCodesRepository');

module.exports = new BaseService(repo, 'PROMO CODES');
