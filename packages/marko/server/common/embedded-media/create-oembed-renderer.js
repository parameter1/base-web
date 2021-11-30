const BrowserComponent = require('@parameter1/base-web-marko-components-core/components/browser-component.marko');

module.exports = ({ marko, $global }) => (tag) => {
  const props = {
    serviceUri: marko.get('oembed.uri'),
    url: tag.id,
    attrs: tag.attrs,
  };
  return BrowserComponent.renderToString({ $global, name: 'CoreOEmbed', props });
};
