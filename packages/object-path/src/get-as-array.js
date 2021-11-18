const { asArray } = require('@parameter1/base-web-utils');
const get = require('./get');

/**
 * Gets an object path value (via dot-notation) as an array.
 *
 * @param {object} obj
 * @param {string} path
 * @returns {array}
 */
module.exports = (obj, path) => asArray(get(obj, path, []));
