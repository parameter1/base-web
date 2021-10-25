export default (conf) => ({
  prop: conf.get('baseBrowseGraphQL.prop'),
  name: conf.get('app.name'),
  version: conf.get('app.version'),
  uri: conf.get('baseBrowseGraphQL.uri'),
  link: { headers: { 'x-tenant-key': conf.get('tenant.key') } },
});
