import { createError, redirectsAndErrors } from '@parameter1/base-web-server-common';

export default ({ server, conf }) => {
  // Force express to throw 404s instead of handling natively.
  // This will move the error into the "standard" error handler.
  server.use((req, res, next) => { // eslint-disable-line no-unused-vars
    throw createError(404, `No page found for ${req.path}`);
  });

  server.use((error, req, res, next) => { // eslint-disable-line no-unused-vars
    // try {
    //   await redirectsAndErrors({ error });
    // } catch (e) {
    //   // this is real bad!
    //   // log it!
    //   next(e);
    // }
  });
};
