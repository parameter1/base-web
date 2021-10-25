import helmet from 'fastify-helmet';

export default ({ server, conf } = {}) => {
  const { enabled, ...options } = conf.getAsMap('helmet').toJS();
  if (!enabled) return;
  server.register(helmet, options);
};
