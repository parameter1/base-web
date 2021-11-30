const proxy = require('express-http-proxy');

module.exports = ({ server, marko }) => {
  const mountPoint = marko.get('oembed.mountPoint');
  const opts = {
    proxyReqPathResolver: ({ originalUrl }) => originalUrl.replace(mountPoint, '/'),
    proxyReqOptDecorator: (reqOpts, req) => {
      const headers = { ...reqOpts.headers };
      headers['x-forwarded-proto'] = req.protocol;
      return { ...reqOpts, headers };
    },
  };
  server.use(mountPoint, proxy(marko.get('oembed.uri'), opts));
};
