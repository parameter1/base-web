const BrowserComponent = require('@parameter1/base-web-marko-components-core/components/browser-component.marko');

module.exports = ({ marko, $global }) => (tag) => {
  const props = {
    mountPoint: marko.get('oembed.mountPoint'),
    url: tag.id,
    attrs: tag.attrs,
  };
  return BrowserComponent.renderToString({ $global, name: 'CoreOEmbed', props });
};
