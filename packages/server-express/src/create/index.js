const { createServer } = require('http');
const init = require('./init');
const routes = require('./routes');

module.exports = async (params = {}) => {
  const { server, conf } = await init(params);

  routes({ server, conf });

  return { server: createServer(server), conf };
};
