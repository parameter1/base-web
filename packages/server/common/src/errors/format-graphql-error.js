const { set } = require('@parameter1/base-web-object-path');

module.exports = (err) => {
  const { networkError } = err;
  if (!networkError || !networkError.result) return err;
  const { result } = networkError;
  if (result.errors && Array.isArray(result.errors)) {
    const { message } = result.errors[0];
    set(err, 'originalMessage', err.message);
    set(err, 'message', message);
  }
  return err;
};
