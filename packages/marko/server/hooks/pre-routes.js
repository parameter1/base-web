const markoMiddleware = require('@parameter1/base-web-marko-lib/express');
const document = require('@parameter1/base-web-marko-components-core/components/document/index.marko');
const errorTemplate = require('@parameter1/base-web-marko-components-core/components/document/components/error.marko');
const compat = require('./compat');

module.exports = ({ server, conf, marko }) => {
  // set the root document component
  if (!marko.get('document')) marko.set('document', document);
  // set the error template
  if (!marko.get('error.template')) marko.set('error.template', errorTemplate);
  // set the marko config
  server.setToLocals('marko', marko);
  // enabled compat mode (if set)
  compat({ server, conf, marko });
  // install the marko middleware
  server.use(markoMiddleware());
};
