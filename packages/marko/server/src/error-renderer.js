const { STATUS_CODES } = require('http');

module.exports = ({ error, req, res }) => {
  const { status: statusCode } = error;
  const { marko } = req.app.locals;
  const template = marko.get('error.template');
  res.status(error.status);
  res.marko(template, {
    statusCode,
    statusMessage: STATUS_CODES[statusCode],
    error,
  });
};
