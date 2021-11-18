require('@parameter1/base-web-marko/require');
const { createServer } = require('http');
const marko = require('@parameter1/base-web-marko/express');
const baseBrowseGraphql = require('./base-browse-graphql');
const baseCMSGraphql = require('./base-cms-graphql');
const callHook = require('./call-hook');
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
  const { server, conf } = await init(params);
  await callHook('postInit', { server, conf });

  helmet({ server, conf });
  etags({ server, conf });
  cookies({ server, conf });
  baseBrowseGraphql({ server, conf });
  baseCMSGraphql({ server, conf });
  versionsHeader({ server, conf, pkg });
  requestOrigin({ server });

  compat({ server, conf });

  // @todo determine if response bodies need cleaning
  server.use(marko());

  await callHook('preRoutes', { server, conf });
  routes({ server, conf });
  await callHook('postRoutes', { server, conf });

  return { server: createServer(server), conf };
};
