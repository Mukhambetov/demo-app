const Ajv = require('ajv/dist/2019');
const addFormats = require('ajv-formats');
const { cloneDeep } = require('lodash');
const { isDate } = require('lodash');

const ajv = new Ajv({
  removeAdditional: 'all',
  useDefaults: true,
  coerceTypes: true,
});
addFormats(ajv);
ajv.addKeyword({
  keyword: 'jsDate',
  validate: (schema, date) => {
    if (schema) {
      if (typeof date === 'object') {
        return isDate(date);
      }
      return false;
    }
    return true;
  },
});

/**
 * Validates schema, removes all unnecessary properties
 * @param object
 * @param schema
 * @returns - if valid returns object based on permission schema
 */
const validate = (object, schema) => {
  const entity = cloneDeep(object);
  const validator = ajv.compile(schema);
  const valid = validator(entity);
  if (!valid) {
    const [error] = validator.errors;
    throw new Error(`${error.instancePath} ${error.message}`);
  }
  return entity;
};

module.exports = validate;
