const { dasherize } = require('@parameter1/base-web-inflector');
const htmlEntities = require('@parameter1/base-web-html/html-entities');
const {
  TAG_ATTR_PREFIX,
} = require('../constants');

module.exports = (key, value) => {
  if (!key || value == null) return null; // ignore null and undefined
  const k = `${TAG_ATTR_PREFIX}-${dasherize(key)}`;
  const v = htmlEntities.encode(value);
  return `${k}="${v}"`;
};
