const service = require('../services/bikesService');
const crud = require('./crud');

module.exports = (router) => {
    crud(service, router, 'bikes', 'bikeId');
};
