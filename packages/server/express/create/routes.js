const { buildRobotsTxt } = require('@parameter1/base-web-server-common/route-utils');

const isDevelopment = process.env.NODE_ENV === 'development';

module.exports = ({ server, conf } = {}) => {
  // core routes.
  if (isDevelopment) {
    server.get('/__config', (_, res) => {
      res.json(conf.unwrap());
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
