const service = require('../services/referralCodesService');
const crud = require('./crud');

module.exports = (router) => {
  crud(service, router, 'referralCodes', 'referralCodeId');
};
