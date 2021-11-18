const path = require('path');
const { writeFile } = require('fs').promises;
const getFor = require('./get-for');

module.exports = async ({ uri, headers, file } = {}) => {
  if (!file) throw new Error('A file location is required.');
  if (!path.isAbsolute(file)) throw new Error('The file location must be absolute.');
  const ext = path.extname(file);
  if (ext !== 'json') throw new Error('The file must be JSON.');
  const types = await getFor({ uri, headers });
  await writeFile(file, JSON.stringify(types), { encoding: 'utf8' });
};
