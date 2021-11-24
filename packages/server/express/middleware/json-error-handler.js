const { isArray } = Array;

const render = (res, { status, err, showStackTrace }) => {
  const { message, stack } = err;
  const obj = { error: true, status, message };
  if (showStackTrace && stack) obj.stack = stack.split('\n');
  res.status(status).json(obj);
};

const renderNetworkErrorResult = (res, { status, result, showStackTrace }) => {
  const message = result.errors && isArray(result.errors) ? result.errors[0].message : 'Unknown fatal.';
  render(res, { status, err: new Error(message), showStackTrace });
};

// eslint-disable-next-line no-unused-vars
module.exports = () => (err, req, res, next) => {
  const { conf } = req.app.locals;
  const status = err.statusCode || err.status || 500;
  const { networkError } = err;
  const showStackTrace = conf.get('env') === 'development';

  if (!networkError) return render(res, { status, err, showStackTrace });
  if (networkError.result) {
    return renderNetworkErrorResult(res, { status, result: networkError.result, showStackTrace });
  }
  return render(res, { status, err: networkError, showStackTrace });
};
