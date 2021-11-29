const { deprecate } = require('util');
const { isFunction: isFn } = require('@parameter1/base-web-utils');

const msgRemoved = (oldName) => `${oldName} is deprectedd and will be removed. Do not use.`;
const msgDeprecated = (oldName, newName) => `${oldName} is deprecated. Use ${newName} instead.`;

const dep = (fn, oldName, newName) => deprecate(fn, msgDeprecated(oldName, newName), `compat:${oldName}`);

const deprecatedObject = (obj, oldName, newName) => new Proxy(obj, {
  get: (target, prop) => {
    const v = target[prop];
    if (isFn(v)) {
      return dep(v, `${oldName}.${prop}`, `${newName}.${prop}`);
    }
    return v;
  },
});

module.exports = {
  deprecated: dep,
  deprecatedObject,
  removed: (fn, oldName) => deprecate(fn, msgRemoved(oldName), `compat:${oldName}`),
};
