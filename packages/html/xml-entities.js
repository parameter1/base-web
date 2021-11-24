const { encode, decode } = require('html-entities');

const level = 'xml';

module.exports = {
  encode: (v) => encode(v, { level }),
  decode: (v) => decode(v, { level }),
};
