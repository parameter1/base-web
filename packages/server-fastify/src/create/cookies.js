import cookieParser from 'fastify-cookie';

export default ({ server, conf } = {}) => {
  if (!conf.get('cookie.enabled')) return;
  server.register(cookieParser);
};
