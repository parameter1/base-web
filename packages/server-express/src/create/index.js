import init from './init.js';
import baseBrowseGraphql from './base-browse-graphql.js';
import baseCMSGraphql from './base-cms-graphql.js';
import cookies from './cookies.js';
import etags from './etags.js';
import helmet from './helmet.js';
// import redirectsAndErrors from './redirects-and-errors.js';
import requestOrigin from './request-origin.js';
import routes from './routes.js';
import versionsHeader from './versions-header.js';
import pkg from '../../package.js';

/**
 * Boots the BaseCMS web server.
 *
 * @todo at this point, Marko does not need to be involved.
 *
 * @param {object} params
 */
export default async (params = {}) => {
  // preServerCreateInit
  const { server, conf } = await init(params);
  // postServerInit
  helmet({ server, conf });
  etags({ server, conf });
  cookies({ server, conf });
  baseCMSGraphql({ server, conf });
  baseBrowseGraphql({ server, conf });
  versionsHeader({ server, conf, pkg });
  requestOrigin({ server });

  // preServerRoutes
  routes({ server, conf });
  // postServerRoutes

  // must run last.
  // redirectsAndErrors({ server, conf });

  // onServerCreated
  return { conf, server };
};
