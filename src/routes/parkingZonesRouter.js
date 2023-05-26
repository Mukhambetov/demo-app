const service = require('../services/parkingZonesService');
const crud = require('./crud');

module.exports = (router) => {
  crud(service, router, 'parking-zones', 'parkingZoneId');
};
