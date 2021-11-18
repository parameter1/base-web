const { createServer } = require('http');
const cookies = require('./cookies');
const etags = require('./etags');
const helmet = require('./helmet');
const init = require('./init');
const routes = require('./routes');

module.exports = async (params = {}) => {
  // preInit
  const { server, conf } = await init(params);
  // postInit
  helmet({ server, conf });
  etags({ server, conf });
  cookies({ server, conf });

  // preRoutes
  routes({ server, conf });
  // postRoutes
  return { server: createServer(server), conf };
};
