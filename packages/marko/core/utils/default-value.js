const { isFunction: isFn } = require('@parameter1/base-web-utils');

module.exports = (value, def, formatter) => {
  const fn = isFn(formatter) ? formatter : (v) => v;
  return value != null ? fn(value) : def;
};
