export default () => (req, res, next) => {
  res.locals.requestOrigin = `${req.protocol}://${req.get('host')}`;
  next();
};
