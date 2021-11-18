const { validateAsync } = require('@parameter1/joi/utils');
const schema = require('./schema');

module.exports = async (params = {}) => {
  const validated = await validateAsync(schema, params);
  return validated;
};
