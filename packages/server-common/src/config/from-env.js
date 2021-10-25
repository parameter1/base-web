const { env } = process;

export default (obj) => Object.keys(obj).reduce((o, key) => {
  const name = obj[key];
  return {
    ...o,
    ...(env[name] && { [key]: env[name] }),
  };
}, {});
