import fp from 'fastify-plugin';

const plugin = (fastify, _, next) => {
  fastify.decorateRequest('requestOrigin', '');
  fastify.addHook('preHandler', (req, reply, done) => {
    req.requestOrigin = `${req.protocol}://${req.hostname}`;
    done();
  });
  next();
};

export default fp(plugin, {
  name: 'web-server-request-origin',
  fastify: '>=3',
});
