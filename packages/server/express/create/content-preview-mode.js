module.exports = ({ server, conf }) => {
  const param = conf.get('contentPreviewMode.param');
  server.use((req, res, next) => {
    res.locals.contentPreviewModeEnabled = Boolean(req.cookies[param] || req.query[param]);
    next();
  });
};
