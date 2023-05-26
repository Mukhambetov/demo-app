const service = require('../services/promoCodesService');
const promoCodeUsesService = require('../services/promoCodeUsesService');
const crud = require('./crud');
const subCrud = require('./crud-sub');

module.exports = (router) => {
  crud(service, router, 'promo-codes', 'promoCodeId');
  subCrud(
    promoCodeUsesService,
    router,
    'promo-codes',
    'promoCodeId',
    'promo-codes',
    'promoCodeId',
  );
};
