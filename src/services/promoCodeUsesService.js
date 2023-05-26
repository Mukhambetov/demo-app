const BaseService = require('./base-sub-service');
const repo = require('../repositories/promoCodeUsesRepository');

module.exports = new BaseService(repo, 'PROMO CODE USES');
