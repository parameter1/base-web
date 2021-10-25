export default ({ server } = {}) => {
  server.decorateRequest('requestOrigin', '');
  server.addHook('preHandler', (req, reply, done) => {
    req.requestOrigin = `${req.protocol}://${req.hostname}`;
    done();
  });
};
