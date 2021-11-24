module.exports = ({ input = {}, enabled = false }) => {
  if (enabled) return { ...input, status: 'any' };
  return { ...input, since: Date.now() };
};
