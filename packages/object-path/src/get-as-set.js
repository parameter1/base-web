const get = require('./get');

const { isArray } = Array;

/**
 * Gets an object path value (via dot-notation) as a Set.
 *
 * @param {object} obj
 * @param {string} path
 * @returns {Set}
 */
module.exports = (obj, path) => {
  const v = get(obj, path);
  if (v instanceof Set) return v;
  return isArray ? new Set(v) : new Set();
};
