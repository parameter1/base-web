import fastify from 'fastify';

export default async () => {
  const server = fastify();
  server.get('/', (_, reply) => reply.send({ hello: 'world' }));
  return server;
};
