const service = require('../services/referralUsesService');
const crud = require('./crud');

module.exports = (router) => {
  crud(service, router, 'referralUses', 'referralUseId');
};
