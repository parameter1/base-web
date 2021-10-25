const isDevelopment = process.env.NODE_ENV === 'development';

export default ({ server, conf } = {}) => {
  // register site routes first.
  conf.get('routes')(server);
  // then core routes.
  if (isDevelopment) {
    server.get('/__config', (_, reply) => {
      reply.send(conf.map.toObject());
    });
  }
};
