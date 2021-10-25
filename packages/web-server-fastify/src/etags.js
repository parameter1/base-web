import etag from 'fastify-etag';

export default (server, conf) => {
  if (!conf.get('etag.enabled')) return;
  server.register(etag, { weak: conf.get('etag.mode') === 'weak' });
};
