const service = require('../services/usersService');
const crud = require('./crud');

module.exports = (router) => {
  crud(service, router, 'users', 'userId');
};
