const { camelizeKeys, decamelizeKeys } = require('humps');

module.exports = {
  camelize: (entity) => camelizeKeys(entity),
  deCamelize: (entity) => decamelizeKeys(entity, { separator: '_' }),
};
