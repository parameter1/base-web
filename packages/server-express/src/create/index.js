import build from './build.js';
import baseBrowseGraphql from './base-browse-graphql.js';
import baseCMSGraphql from './base-cms-graphql.js';
import cookies from './cookies.js';
import etags from './etags.js';
import helmet from './helmet.js';
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
  const { server, conf } = await build(params);
  etags({ server, conf });
  cookies({ server, conf });
  helmet({ server, conf });
  baseCMSGraphql({ server, conf });
  baseBrowseGraphql({ server, conf });
  versionsHeader({ server, conf, pkg });
  requestOrigin({ server });

  routes({ server, conf });
  return { conf, server };
};
