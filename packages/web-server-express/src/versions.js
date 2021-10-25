import { createVersionHeader } from '@parameter1/marko-base-cms-web-server-common';

export default ({ conf, pkg } = {}) => (_, res, next) => {
  res.set(...createVersionHeader(conf, pkg));
  next();
};
