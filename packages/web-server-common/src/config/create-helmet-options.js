export default (conf) => ({
  frameguard: false,
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  ...conf.get('helmet').toObject(),
});
