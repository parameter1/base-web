const index = require('../templates/index.marko');

module.exports = (server) => {
  server.get('/', (_, res) => res.marko(index));
};
