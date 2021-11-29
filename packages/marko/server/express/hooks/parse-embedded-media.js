const createEmbeddedMediaParser = require('@parameter1/base-web-marko-server-common/create-embedded-media-parser');
const buildMarkoGlobal = require('@parameter1/base-web-marko-lib/express/build-global');

module.exports = ({ server, marko }) => {
  const embedParser = createEmbeddedMediaParser({ marko });
  server.use((_, res, next) => {
    res.locals.parseEmbeddedMedia = (html, options) => embedParser({
      html,
      $global: buildMarkoGlobal(res),
      options,
    });
    next();
  });
};
