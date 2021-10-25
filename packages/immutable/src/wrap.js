import { fromJS, List, Map } from 'immutable';

const { log } = console;

export default (obj) => {
  const map = fromJS(obj);
  /**
   *
   * @param {string} path
   * @returns {*|Map|List}
   */
  const get = (path) => map.getIn(path.split('.'));
  return {
    log: log(obj),
    map,
    get,

    /**
     * @param {string} path
     * @returns {List}
     */
    getAsList: (path) => {
      const v = get(path);
      if (v instanceof List) return v;
      return List();
    },

    /**
     * @param {string} path
     * @returns {Map}
     */
    getAsMap: (path) => {
      const v = get(path);
      if (v instanceof Map) return v;
      return Map();
    },
  };
};
