import { buildRobotsTxt } from '@parameter1/base-web-server-common';

const isDevelopment = process.env.NODE_ENV === 'development';

export default ({ server, conf } = {}) => {
  // core routes.
  if (isDevelopment) {
    server.get('/__config', (_, res) => {
      res.json(conf.map.toObject());
    });
  }
  if (conf.get('robots.enabled')) {
    server.get('/robots.txt', (_, res) => {
      res.type('text/plain').send(buildRobotsTxt({ conf }));
    });
  }
  // then site routes.
  conf.get('routes')(server);
};
