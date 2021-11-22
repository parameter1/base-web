const { deprecate } = require('util');

const msgRemoved = (oldName) => `${oldName} is deprectedd and will be removed. Do not use.`;
const msgDeprecated = (oldName, newName) => `${oldName} is deprecated. Use ${newName} instead.`;

module.exports = {
  deprecated: (fn, oldName, newName) => deprecate(fn, msgDeprecated(oldName, newName), `compat:${oldName}`),
  removed: (fn, oldName) => deprecate(fn, msgRemoved(oldName), `compat:${oldName}`),
};
