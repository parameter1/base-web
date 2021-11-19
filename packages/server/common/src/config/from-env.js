const { env } = process;

const { isArray } = Array;

module.exports = (obj) => Object.keys(obj).reduce((o, key) => {
  const name = obj[key];
  if (!name) return o;
  const names = isArray(name) ? name : [name];
  const toSet = names.find((n) => env[n]);
  if (!toSet) return o;
  return { ...o, [key]: env[toSet] };
}, {});
