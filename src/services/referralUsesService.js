const BaseService = require('./base-service');
const repo = require('../repositories/referralUsesRepository');

module.exports = new BaseService(repo, 'REFERRAL USES');
