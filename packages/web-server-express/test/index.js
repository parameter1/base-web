import run from '../src/index.js';

run({
  app: {
    name: '@randall-reilly/overdriveonline.com',
    version: '1.19.9',
  },
  baseCMSGraphQL: {
    url: 'https://graphql.virgon.base.parameter1.com',
  },
  site: {
    id: '5fce561dd28860bc33b823ce',
    name: 'Overdrive',
  },
  tenant: {
    key: 'randallreilly_all',
  },
});
