module.exports = ({ server } = {}) => {
  server.use((req, res, next) => {
    const { protocol } = req;
    const host = req.get('host');
    res.locals.request = {
      origin: `${protocol}://${host}`,
      host,
      hostname: req.hostname,
      protocol,
      path: req.path,
      query: req.query,
      cookies: req.cookies,
      headers: req.headers,
    };
    next();
  });
};
