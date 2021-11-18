const { isFunction: isFn } = require('@parameter1/base-web-utils');

module.exports = async (name, { server, conf } = {}) => {
  const hook = conf.get(`hooks.${name}`);
  if (isFn(hook)) await hook({ server, conf });
};
