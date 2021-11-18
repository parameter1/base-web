import { bootServer } from '../src/index.js';
import { contentFromId, websiteSectionFromAlias } from '../src/route-handlers/index.js';

bootServer({
  app: {
    // normally would come from the site's package.json
    name: '@randall-reilly/overdriveonline.com',
    version: '1.19.9',
  },
  baseBrowseGraphQLClient: {
    uri: 'https://base-browse.virgon.base.parameter1.com/graphql',
  },
  baseCMSGraphQLClient: {
    uri: 'https://graphql.virgon.base.parameter1.com',
  },
  robots: {
    directives: [{ agent: '*', value: 'Disallow: /search' }],
  },
  // would normally be loaded from the site
  routes: (server) => {
    // homepage
    server.get('/', websiteSectionFromAlias({
      aliasResolver: () => 'home',
      render: ({ section, reply }) => reply.send({ server: 'fastify', section }),
    }));
    // content pages
    server.get('/:id(^\\d{8})', contentFromId({
      render: async ({ content, node, res }) => {
        const resolved = await node.toObject();
        return res.json({ content, resolved });
      },
    }));
    // section pages
    server.get('/:alias', websiteSectionFromAlias({
      render: async ({ section, node, reply }) => {
        const resolved = await node.toObject();
        return reply.send({ section, resolved });
      },
    }));
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
