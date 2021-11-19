const path = require('path');
const writeFor = require('../write-for');

const { log } = console;

(async () => {
  log('Generating types...');
  const file = path.resolve(__dirname, './types.json');
  await writeFor({
    uri: process.env.BASE_CMS_GRAPHQL_URI,
    headers: { 'x-tenant-key': process.env.BASE_CMS_GRAPHQL_TENANT_KEY || 'p1_sandbox' },
    file,
  });
  log(`Done. Types generated to ${file}`);
})().catch((e) => { throw e; });
