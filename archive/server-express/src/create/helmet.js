import helmet from 'helmet';

export default ({ server, conf } = {}) => {
  const { enabled, ...options } = conf.getAsMap('helmet').toJS();
  if (!enabled) return;
  server.use(helmet(options));
};
