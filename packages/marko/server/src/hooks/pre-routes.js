const markoMiddleware = require('@parameter1/base-web-marko-lib/express');
const document = require('@parameter1/base-web-marko-core/components/document/index.marko');
const compat = require('./compat');

module.exports = ({ server, conf, marko }) => {
  // this is only being added to move `$conf` to the root marko out.global
  server.setToLocals('$conf', conf);
  // set the root document component
  if (!marko.get('document')) marko.set('document', document);
  // set the marko config
  server.setToLocals('$marko', marko);
  // enabled compat mode (if set)
  compat({ server, conf, marko });
  // install the marko middleware
  server.use(markoMiddleware());
};
