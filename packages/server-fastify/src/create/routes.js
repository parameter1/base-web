import { buildRobotsTxt } from '@parameter1/base-web-server-common';

const isDevelopment = process.env.NODE_ENV === 'development';

export default ({ server, conf } = {}) => {
  // core routes.
  if (isDevelopment) {
    server.get('/__config', (_, reply) => {
      reply.send(conf.map.toObject());
    });
  }
  if (conf.get('robots.enabled')) {
    server.get('/robots.txt', (_, reply) => {
      reply.type('text/plain; charset=utf-8').send(buildRobotsTxt({ conf }));
    });
  }
  // then site routes.
  conf.get('routes')(server);
};
