const service = require('../services/bikeTypesService');
const crud = require('./crud');

module.exports = (router) => {
  crud(service, router, 'bike-types', 'bikeTypeId');
};
