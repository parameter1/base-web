import { fromJS, List, Map } from 'immutable';

const { log } = console;

export default (obj) => {
  const map = fromJS(obj);
  const get = (path) => map.getIn(path.split('.'));
  return {
    log: log(obj),
    map,
    get,
    getAsList: (path) => {
      const v = get(path);
      if (v instanceof List) return v;
      return List();
    },
    getAsMap: (path) => {
      const v = get(path);
      if (v instanceof Map) return v;
      return Map();
    },
  };
};
