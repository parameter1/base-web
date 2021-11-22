module.exports = ({ server, conf }) => {
  const param = conf.get('contentPreviewMode.param');
  server.use((req, res, next) => {
    req.$contentPreviewModeEnabled = Boolean(req.cookies[param] || req.query[param]);
    next();
  });
};
