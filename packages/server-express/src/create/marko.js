const marko = require('@parameter1/base-web-marko/express');

module.exports = ({ server, conf } = {}) => {
  server.use(marko());
};
