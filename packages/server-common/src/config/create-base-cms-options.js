export default (conf) => ({
  prop: conf.get('baseCMSGraphQL.prop'),
  name: conf.get('app.name'),
  version: conf.get('app.version'),
  uri: conf.get('baseCMSGraphQL.uri'),
  link: {
    headers: {
      'x-tenant-key': conf.get('tenant.key'),
      'x-site-id': conf.get('site.id'),
      'x-cache-responses': conf.get('baseCMSGraphQL.cacheResponses'),
      'x-cache-site-context': conf.get('baseCMSGraphQL.cacheSiteContext'),
    },
  },
});
