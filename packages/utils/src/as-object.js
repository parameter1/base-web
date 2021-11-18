const isObject = require('./is-object');

/**
 * Forces a value to be returned as an object.
 *
 * @param {*} v The value to process.
 * @returns {array}
 */
module.exports = (v) => (isObject(v) ? v : {});
