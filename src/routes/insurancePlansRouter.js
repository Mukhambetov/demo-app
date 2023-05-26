const service = require('../services/insurancePlansService');
const crud = require('./crud');

module.exports = (router) => {
  crud(service, router, 'insurance-plans', 'insurancePlanId');
};
