const { statSync, promises } = require('fs');

const { stat } = promises;

const handleError = (e, { throwOnNotFound }) => {
  if (e.code === 'ENOENT') {
    if (throwOnNotFound) throw e;
    return null;
  }
  throw e;
};

module.exports = {
  async: async (path, { throwOnNotFound = true } = {}) => {
    try {
      const stats = await stat(path);
      return stats;
    } catch (e) {
      return handleError(e, { throwOnNotFound });
    }
  },
  sync: (path, { throwOnNotFound = true } = {}) => {
    try {
      return statSync(path);
    } catch (e) {
      return handleError(e, { throwOnNotFound });
    }
  },
};
