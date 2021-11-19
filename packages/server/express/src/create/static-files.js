const express = require('express');
const path = require('path');

module.exports = ({ server, conf }) => {
  const cwd = conf.get('cwd');
  const dir = path.resolve(cwd, 'dist');
  server.use('/dist/css', express.static(`${dir}/css`, { maxAge: '2y', immutable: true }));
  server.use('/dist/js', express.static(`${dir}/js`, { maxAge: '2y', immutable: true }));

  server.use(express.static(path.join(cwd, 'server/public')));
};
