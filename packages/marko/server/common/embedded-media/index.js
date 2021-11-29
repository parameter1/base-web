const imageHandler = require('./image-handler');
const oembedHandler = require('./oembed-handler');
const createOembedRenderer = require('./create-oembed-renderer');

module.exports = {
  createOembedRenderer,
  imageHandler,
  oembedHandler,
  invalidHandler: () => '',
};
