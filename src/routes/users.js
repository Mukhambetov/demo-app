const service = require('../services/user');
const crud = require('./crud');

module.exports = (router) => {
    crud(service, router, 'users', 'userId');
};
