import cookieParser from 'cookie-parser';

export default ({ server, conf } = {}) => {
  if (!conf.get('cookie.enabled')) return;
  server.use(cookieParser());
};
