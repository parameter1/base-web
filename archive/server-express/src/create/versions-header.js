import { createVersionHeader } from '@parameter1/base-web-server-common';

export default ({ server, conf, pkg } = {}) => {
  server.use((_, res, next) => {
    res.set(...createVersionHeader({ conf, pkg }));
    next();
  });
};
