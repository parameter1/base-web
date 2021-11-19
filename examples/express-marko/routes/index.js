module.exports = (server) => {
  server.get('/', (_, res) => res.json({ hello: 'world' }));
};
