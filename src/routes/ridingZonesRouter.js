const service = require('../services/ridingZonesService');
const crud = require('./crud');

module.exports = (router) => {
  crud(service, router, 'riding-zones', 'ridingZoneId');
};
