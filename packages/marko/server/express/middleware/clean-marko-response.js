const cleanChunk = require('@parameter1/base-web-marko-server-common/clean-response-chunk');
const buildMarkoGlobal = require('@parameter1/base-web-marko-lib/express/build-global');
const pretty = require('pretty');

module.exports = ({ enabled = true, prettyQueryParam = 'pretty' } = {}) => (req, res, next) => {
  if (!enabled || !res.marko) return next();
  if (res.locals.cleanMarkoResponseApplied) return next();

  res.locals.cleanMarkoResponseApplied = true;
  const { write } = res;
  const prettyOutput = Object.hasOwnProperty.call(req.query, prettyQueryParam);

  if (prettyOutput) {
    res.marko = function output(template, data) {
      if (typeof template === 'string') {
        throw new Error('The Marko template cannot be a string.');
      }
      const $global = buildMarkoGlobal(this, data);
      const d = { ...(data || {}), $global };
      this.set({ 'content-type': 'text/html; charset=utf-8' });
      const out = template.createOut();
      template.render(d, out);

      out.on('error', next);
      out.on('finish', () => {
        const html = cleanChunk(out.getOutput());
        this.send(pretty(html));
      });
      out.end();
    };
    return next();
  }

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
