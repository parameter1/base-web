const { isFunction: isFn } = require('@parameter1/base-web-utils');
const facebookHandler = require('./facebook');
const instagramHandler = require('./instagram');

module.exports = (tag, { renderer } = {}) => {
  const url = tag.id;
  const facebook = facebookHandler(url);
  const instagram = instagramHandler(url);
  if (facebook) return facebook;
  if (instagram) return instagram;
  return isFn(renderer) ? renderer(tag) : null;
};
