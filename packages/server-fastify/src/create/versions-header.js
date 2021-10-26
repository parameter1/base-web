import { createVersionHeader } from '@parameter1/base-web-server-common';

export default ({ server, conf, pkg } = {}) => {
  server.addHook('preHandler', (_, reply, done) => {
    reply.header(...createVersionHeader({ conf, pkg }));
    done();
  });
};
