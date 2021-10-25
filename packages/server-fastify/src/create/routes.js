import { buildRobotsTxt } from '@parameter1/base-web-server-common';

const isDevelopment = process.env.NODE_ENV === 'development';

export default ({ server, conf } = {}) => {
  // register site routes first.
  conf.get('routes')(server);
  // then core routes.
  if (isDevelopment) {
    server.get('/__config', (_, reply) => {
      reply.send(conf.map.toObject());
    });
  }
  server.get('/robots.txt', (_, reply) => {
    reply.type('text/plain; charset=utf-8').send(buildRobotsTxt({ conf }));
  });
};
