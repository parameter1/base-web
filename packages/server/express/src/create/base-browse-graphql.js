const apollo = require('@parameter1/base-web-apollo-ssc-express');
const { createBaseBrowseOptions } = require('@parameter1/base-web-server-common/config');

module.exports = ({ server, conf } = {}) => {
  server.use(apollo(createBaseBrowseOptions({ conf })));
};
