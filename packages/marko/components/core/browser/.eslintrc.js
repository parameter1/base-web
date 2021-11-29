module.exports = {
  extends: [
    'airbnb-base',
    'plugin:vue/recommended',
  ],
  env: {
    browser: true,
  },
  parserOptions: {
    parser: '@babel/eslint-parser',
    requireConfigFile: false,
  },
};
