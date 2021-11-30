module.exports = (v) => (v instanceof Date ? v.valueOf() : v);
