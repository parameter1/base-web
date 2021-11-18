module.exports = ({ server } = {}) => {
  server.use((req, _, next) => {
    req.$requestOrigin = `${req.protocol}://${req.get('host')}`;
    next();
  });
};
