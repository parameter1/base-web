import run from '../src/index.js';

run({
  app: {
    // normally would come from the site's package.json
    name: '@randall-reilly/overdriveonline.com',
    version: '1.19.9',
  },
  baseCMSGraphQL: {
    url: 'https://graphql.virgon.base.parameter1.com',
  },
  site: {
    id: '5fce561dd28860bc33b823ce',
    name: 'Overdrive',
    description: 'Overdrive is a site dedicated to covering the trucking industry as it relates to owner operators.',
    host: 'www.overdriveonline.com',
    imageHost: 'img.overdriveonline.com',
    assetHost: 'img.overdriveonline.com',
    // would normally be loaded from the site's config folder
    config: {
      navigation: {
        primary: [
          { href: '/equipment', label: 'Equipment' },
          { href: '/business', label: 'Business' },
          { href: '/regulations', label: 'Regulations' },
          { href: '/life', label: 'Life' },
          { href: '/custom-rigs', label: 'Custom Rigs' },
          { href: '/gear', label: 'Gear' },
        ],
      },
    },
  },
  tenant: {
    key: 'randallreilly_all',
  },
});
