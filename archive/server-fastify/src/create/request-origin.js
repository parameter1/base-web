export default ({ server } = {}) => {
  server.decorateRequest('$requestOrigin', '');
  server.addHook('preHandler', (req, _, done) => {
    req.$requestOrigin = `${req.protocol}://${req.hostname}`;
    done();
  });
};
