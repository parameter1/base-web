const { createServer } = require('http');
const baseBrowseGraphql = require('./base-browse-graphql');
const baseCMSGraphql = require('./base-cms-graphql');
const callHook = require('./call-hook');
const contentPreviewMode = require('./content-preview-mode');
const cookies = require('./cookies');
const etags = require('./etags');
const helmet = require('./helmet');
const init = require('./init');
const pkg = require('../package.json');
const redirectsAndErrors = require('./redirects-and-errors');
const requestInfo = require('./request-info');
const routes = require('./routes');
const staticFiles = require('./static-files');
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
  requestInfo({ server });
  contentPreviewMode({ server, conf });

  await callHook('preRoutes', { server, conf });
  routes({ server, conf });
  await callHook('postRoutes', { server, conf });

  staticFiles({ server, conf });

  redirectsAndErrors({ server, conf });
  return { server: createServer(server), conf };
};
