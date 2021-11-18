const cookieParser = require('cookie-parser');

module.exports = ({ server, conf } = {}) => {
  if (!conf.get('cookie.enabled')) return;
  server.use(cookieParser());
};
