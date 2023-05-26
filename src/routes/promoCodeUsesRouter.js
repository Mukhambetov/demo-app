const service = require('../services/promoCodeUsesService');
const crud = require('./crud');

module.exports = (router) => {
  crud(service, router, 'promo-code-uses', 'promoCodeUseId');
};
