const service = require('../services/rentalsService');
const crud = require('./crud');

module.exports = (router) => {
  crud(service, router, 'rentals', 'rentalId');
};
