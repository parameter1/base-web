const isDevelopment = process.env.NODE_ENV === 'development';

export default ({ server, conf } = {}) => {
  // register site routes first.
  conf.get('routes')(server);
  // then core routes.
  if (isDevelopment) {
    server.get('/__config', (_, res) => {
      res.json(conf.map.toObject());
    });
  }
};
