import express from 'express';

export default async () => {
  const server = express();
  server.get('/', (_, res) => res.json({ hello: 'world' }));
  return server;
};
