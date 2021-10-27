export default ({ req } = {}) => {
  const param = req.server.$conf.get('contentPreviewMode.param');
  return Boolean(req.cookies[param] || req.query[param]);
};
