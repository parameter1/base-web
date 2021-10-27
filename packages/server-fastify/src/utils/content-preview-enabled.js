export default ({ conf, req } = {}) => {
  const param = conf.get('contentPreviewMode.param');
  return Boolean(req.cookies[param] || req.query[param]);
};
