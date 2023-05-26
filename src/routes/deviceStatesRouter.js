const service = require('../services/deviceStatesService');
const crud = require('./crud');

module.exports = (router) => {
  crud(service, router, 'device-states', 'deviceStateId');
};
