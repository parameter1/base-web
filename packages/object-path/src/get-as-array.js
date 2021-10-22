import { asArray } from '@parameter1/marko-base-cms-utils';
import get from './get.js';

/**
 * Gets a object path value (via dot-notation) as an array.
 *
 * @param {object} obj
 * @param {string} path
 * @returns {array}
 */
export default (obj, path) => asArray(get(obj, path, []));
