export default (conf) => ({
  prop: conf.get('baseBrowseGraphQLClient.prop'),
  name: conf.get('app.name'),
  version: conf.get('app.version'),
  uri: conf.get('baseBrowseGraphQLClient.uri'),
  link: { headers: { 'x-tenant-key': conf.get('tenant.key') } },
});
