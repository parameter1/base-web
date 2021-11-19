const marko = require('@parameter1/base-web-marko/express');
const document = require('../components/document/index.marko');

module.exports = ({ server, conf } = {}) => {
  if (!conf.get('marko.document')) conf.set('marko.document', document);
  server.use(marko());
};
