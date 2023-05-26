const BaseService = require('./base-service');
const repo = require('../repositories/usersRepository');

module.exports = new BaseService(repo, 'USERS');
