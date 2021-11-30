const { isFunction: isFn } = require('@parameter1/base-web-utils');
const extract = require('@parameter1/base-web-embedded-media/extract');
const {
  createOembedRenderer,
  imageHandler,
  invalidHandler,
  oembedHandler,
} = require('./embedded-media');

const validTypes = new Set(['image', 'oembed']);

module.exports = ({ marko }) => {
  const fns = marko.getAsObject('embeddedMedia.handlers');
  const handlers = {
    image: isFn(fns.image) ? fns.image : imageHandler,
    invalid: isFn(fns.invalid) ? fns.invalid : invalidHandler,
    oembed: isFn(fns.oembed) ? fns.oembed : oembedHandler,
  };

  return ({ html, $global, options = {} } = {}) => {
    const replacements = extract(html).map((tag) => {
      const type = validTypes.has(tag.type) && tag.isValid() ? tag.type : 'invalid';
      const pattern = tag.getRegExp();
      const replacement = handlers[type](tag, {
        ...options,
        ...(tag.type === 'oembed' && { renderer: createOembedRenderer({ $global, marko }) }),
      });
      if (!replacement) throw new Error(`Unable to get an embedded value for tag type ${tag.type} with ID ${tag.id}`);
      return { pattern, replacement };
    });

    let parsed = html;
    replacements.forEach(({ pattern, replacement }) => {
      parsed = parsed.replace(pattern, replacement);
    });
    return parsed;
  };
};
