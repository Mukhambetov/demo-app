const service = require('../services/deviceStatesHistoryService');
const crud = require('./crud');

module.exports = (router) => {
  crud(service, router, 'device-states-history', 'deviceStateHistoryId');
};
