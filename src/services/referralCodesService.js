const BaseService = require('./base-service');
const repo = require('../repositories/referralCodesRepository');

module.exports = new BaseService(repo, 'REFERRAL CODES');
