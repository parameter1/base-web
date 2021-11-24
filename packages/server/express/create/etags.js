module.exports = ({ server, conf } = {}) => {
  if (!conf.get('etag.enabled')) {
    server.set('etag', false);
  } else {
    server.set(conf.get('etag.mode'));
  }
};
