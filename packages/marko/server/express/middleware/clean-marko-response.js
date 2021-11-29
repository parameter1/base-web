const cleanChunk = require('@parameter1/base-web-marko-server-common/clean-response-chunk');

module.exports = ({ enabled = true } = {}) => (req, res, next) => {
  if (!enabled || !res.marko) return next();
  if (res.locals.cleanMarkoResponseApplied) return next();

  res.locals.cleanMarkoResponseApplied = true;
  const { write } = res;

  res.write = function clean(...args) {
    const [chunk] = args;
    if (typeof chunk !== 'string') {
      write.apply(this, args);
    } else {
      const cleanedArgs = [...args];
      cleanedArgs[0] = cleanChunk(chunk);
      write.apply(this, cleanedArgs);
    }
  };

  return next();
};
