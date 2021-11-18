const { asObject } = require('@parameter1/base-web-utils');
const get = require('./get');

/**
 * Gets an object path value (via dot-notation) as an object.
 *
 * @param {object} obj
 * @param {string} path
 * @returns {object}
 */
module.exports = (obj, path) => asObject(get(obj, path, {}));
