export default (conf) => ({
  prop: conf.get('baseCMSGraphQLClient.prop'),
  name: conf.get('app.name'),
  version: conf.get('app.version'),
  uri: conf.get('baseCMSGraphQLClient.uri'),
  link: {
    headers: {
      'x-tenant-key': conf.get('tenant.key'),
      'x-site-id': conf.get('site.id'),
      'x-cache-responses': conf.get('baseCMSGraphQLClient.cacheServerResponses'),
      'x-cache-site-context': conf.get('baseCMSGraphQLClient.cacheServerSiteContext'),
    },
  },
});
