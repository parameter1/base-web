const { log: l } = console;

module.exports = ({ conf, log = l } = {}) => {
  log(`Env: ${conf.get('env') || '(not specified)'}`);
  log(`App: ${conf.get('app.name')} v${conf.get('app.version')}`);
  log(`Tenant: ${conf.get('tenant.key')}`);
  log(`Site ID: ${conf.get('site.id')}`);
  log(`BaseBrowse GraphQL URI: ${conf.get('baseBrowseGraphQLClient.uri')}`);
  log(`BaseCMS GraphQL URI: ${conf.get('baseCMSGraphQLClient.uri')}`);
  if (process.send) process.send({ event: 'ready', conf });
};
