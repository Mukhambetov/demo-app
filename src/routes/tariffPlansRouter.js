const service = require('../services/tariffPlansService');
const crud = require('./crud');

module.exports = (router) => {
  crud(service, router, 'tariffPlans', 'tariffPlanId');
};
