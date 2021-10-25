import helmet from 'helmet';
import { createHelmetOptions } from '@parameter1/base-web-server-common';

export default ({ server, conf } = {}) => {
  if (!conf.get('helmet.enabled')) return;
  server.use(helmet(createHelmetOptions(conf)));
};
