const { encode, decode } = require('html-entities');

const level = 'html5';

module.exports = {
  encode: (v) => encode(v, { level }),
  decode: (v) => decode(v, { level }),
};
