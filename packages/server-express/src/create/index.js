require('@parameter1/base-web-marko/require');
const { createServer } = require('http');
const marko = require('@parameter1/base-web-marko/express');
const compat = require('./compat');
const cookies = require('./cookies');
const etags = require('./etags');
const helmet = require('./helmet');
const init = require('./init');
const pkg = require('../../package.json');
const requestOrigin = require('./request-origin');
const routes = require('./routes');
const versionsHeader = require('./versions-header');

module.exports = async (params = {}) => {
  // preInit
  const { server, conf } = await init(params);
  // postInit
  helmet({ server, conf });
  etags({ server, conf });
  cookies({ server, conf });
  versionsHeader({ server, conf, pkg });
  requestOrigin({ server });

  compat({ server, conf });

  // @todo determine if response bodies need cleaning
  server.use(marko());

  // preRoutes
  routes({ server, conf });
  // postRoutes
  return { server: createServer(server), conf };
};
