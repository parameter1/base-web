const { isObject } = require('@parameter1/base-web-utils');
const get = require('./get');

/**
 * Gets an object path value (via dot-notation) as a Map.
 *
 * @param {object} obj
 * @param {string} path
 * @returns {Map}
 */
module.exports = (obj, path) => {
  const v = get(obj, path);
  if (v instanceof Map) return v;
  return isObject ? new Map(v) : new Map();
};
