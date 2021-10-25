import fp from 'fastify-plugin';
import { createVersionHeader } from '@parameter1/marko-base-cms-web-server-common';

const plugin = (fastify, { conf, pkg } = {}, next) => {
  fastify.addHook('preHandler', (_, reply, done) => {
    reply.header(...createVersionHeader(conf, pkg));
    done();
  });
  next();
};

export default fp(plugin, {
  name: 'web-server-versions',
  fastify: '>=3',
});
