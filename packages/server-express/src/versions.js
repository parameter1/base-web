import { createVersionHeader } from '@parameter1/base-web-server-common';

export default ({ conf, pkg } = {}) => (_, res, next) => {
  res.set(...createVersionHeader(conf, pkg));
  next();
};
