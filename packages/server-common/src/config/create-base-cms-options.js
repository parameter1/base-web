export default (conf) => ({
  prop: conf.get('baseCMSGraphQL.prop'),
  name: conf.get('app.name'),
  version: conf.get('app.version'),
  uri: conf.get('baseCMSGraphQL.uri'),
  link: {
    headers: {
      'x-tenant-key': conf.get('tenant.key'),
      'x-site-id': conf.get('site.id'),
      ...(conf.get('baseCMSGraphQL.cacheResponses') && { 'x-cache-responses': true }),
    },
  },
});
