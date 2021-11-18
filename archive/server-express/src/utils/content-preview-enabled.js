export default ({ req } = {}) => {
  const param = req.app.$conf.get('contentPreviewMode.param');
  return Boolean(req.cookies[param] || req.query[param]);
};
