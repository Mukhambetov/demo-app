const userRoutes = require('./users');
const bikesRoutes = require('./bikes');


module.exports = (router) => {
  userRoutes(router);
  bikesRoutes(router);
};
