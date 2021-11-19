const { inspect } = require('util');
const get = require('./get');
const getAsArray = require('./get-as-array');
const getAsMap = require('./get-as-map');
const getAsObject = require('./get-as-object');
const getAsSet = require('./get-as-set');
const set = require('./set');

/**
 * Wraps an object with path getters.
 *
 * @param {object} obj
 * @returns {object} The wrapped object.
 */
module.exports = (obj) => ({
  /**
   * Inspects the wrapped object.
   *
   * @param {object} opts
   */
  inspect: (opts = {}) => inspect(obj, { colors: true, depth: 5, ...opts }),

  /**
   * Gets a value from the object for the provided dot-notated path.
   *
   * @param {string} path The dot-notated path.
   * @param {*} def The default value if undefined.
   */
  get: (path, def) => get(obj, path, def),

  /**
   * Gets and forces an array value from the object for the provided dot-notated path.
   *
   * @param {string} path The dot-notated path.
   * @returns {array}
   */
  getAsArray: (path) => getAsArray(obj, path),

  /**
   * Gets and forces a Map value from the object for the provided dot-notated path.
   *
   * @param {string} path The dot-notated path.
   * @returns {Map}
   */
  getAsMap: (path) => getAsMap(obj, path),

  /**
   * Gets and forces an object value from the object for the provided dot-notated path.
   *
   * @param {string} path The dot-notated path.
   * @returns {object}
   */
  getAsObject: (path) => getAsObject(obj, path),

  /**
   * Gets and forces a Set value from the object for the provided dot-notated path.
   *
   * @param {string} path The dot-notated path.
   * @returns {Set}
   */
  getAsSet: (path) => getAsSet(obj, path),

  /**
   * Sets an object path value (via dot-notation).
   */
  set: (path, value) => {
    set(obj, path, value);
  },

  /**
   * Returns the original object as-is.
   */
  unwrap: () => obj,
});
