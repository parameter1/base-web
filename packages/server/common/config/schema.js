const Joi = require('@parameter1/joi');

const isProduction = process.env.NODE_ENV === 'production';

module.exports = Joi.object({
  app: Joi.object({
    name: Joi.string().trim().required(),
    version: Joi.string().trim().required(),
  }).required(),
  baseBrowseGraphQLClient: Joi.object({
    uri: Joi.string().trim().uri().required(),
  }).required(),
  baseCMSGraphQLClient: Joi.object({
    uri: Joi.string().trim().uri().required(),
    cacheServerResponses: Joi.boolean().truthy('1').falsy('0').default(true),
    cacheServerSiteContext: Joi.boolean().truthy('1').falsy('0').default(true),
  }).required(),
  contentPreviewMode: Joi.object({
    param: Joi.string().trim().default('preview-mode'),
  }).default({ param: 'preview-mode' }),
  cookie: Joi.object({
    enabled: Joi.boolean().truthy('1').falsy('0').default(true),
  }).default({ enabled: true }),
  cwd: Joi.string().trim().required(),
  env: Joi.string().trim().default(process.env.NODE_ENV || ''),
  error: Joi.object({
    notifier: Joi.function(),
    renderer: Joi.function(),
  }),
  etag: Joi.object({
    enabled: Joi.boolean().truthy('1').falsy('0').default(true),
    mode: Joi.string().trim().lowercase().valid('weak', 'strong')
      .default('weak'),
  }).default({ enabled: true, mode: 'weak' }),
  globals: Joi.array().items(
    Joi.object({
      scope: Joi.string().trim().lowercase().allow('server', 'request', 'response')
        .required(),
      name: Joi.string().trim().required(),
    }),
  ).default([]).external((v) => {
    const builtIns = [
      { scope: 'server', name: 'conf' },
      { scope: 'response', name: 'baseBrowseGraphQLClient' },
      { scope: 'response', name: 'baseCMSGraphQLClient' },
      { scope: 'response', name: 'request' },
    ];
    return [...builtIns, ...v].reduce((map, o) => {
      if (!map.has(o.scope)) map.set(o.scope, new Set());
      map.get(o.scope).add(o.name);
      return map;
    }, new Map());
  }),
  helmet: Joi.object({
    enabled: Joi.boolean().truthy('1').falsy('0').default(true),
    frameguard: Joi.boolean().default(false),
    // @todo enable and re-evaluate
    contentSecurityPolicy: Joi.boolean().default(false),
    referrerPolicy: Joi.object({
      policy: Joi.string().default('strict-origin-when-cross-origin'),
    }).default({ policy: 'strict-origin-when-cross-origin' }),
  }).unknown().default({ enabled: true, frameguard: false, referrerPolicy: {} }),
  hooks: Joi.object({
    postInit: Joi.function(),
    preRoutes: Joi.function(),
    postRoutes: Joi.function(),
  }),
  redirectHandler: Joi.function(),
  robots: Joi.object({
    enabled: Joi.boolean().truthy('1').falsy('0').default(true),
    directives: Joi.array().items(
      Joi.object({ agent: Joi.string().trim().required(), value: Joi.string().trim().required() }),
    ).default([]).external((v) => {
      // ensure unique list of directives per agent (including defaults)
      const defaults = [{ agent: '*', value: 'Disallow: /__' }];
      return [...defaults, ...v].reduce((map, o) => {
        if (!map.has(o.agent)) map.set(o.agent, new Set());
        map.get(o.agent).add(o.value);
        return map;
      }, new Map());
    }),
    disallowAll: Joi.boolean().truthy('1').falsy('0').default(!isProduction),
  }).default({ enabled: true, directives: [], disallowAll: !isProduction }),
  routes: Joi.function().minArity(1).required(),
  server: Joi.object({
    host: Joi.string().trim().default('localhost'),
    exposedHost: Joi.string().trim().default((parent) => parent.host),
    port: Joi.number().port().default(45893),
    exposedPort: Joi.number().port().default((parent) => parent.port),
  }).required(),
  site: Joi.object({
    id: Joi.string().trim().pattern(/^[a-f0-9]{24}$/).required(),
    name: Joi.string().trim().required(),
    description: Joi.string().trim().allow(null),
    host: Joi.string().trim().hostname().required(),
    imageHost: Joi.string().trim().hostname().required(),
    assetHost: Joi.string().trim().hostname().required(),
    date: Joi.object({
      timezone: Joi.string().trim().default('America/Chicago'),
      format: Joi.string().trim().default('MMM Do, YYYY'),
      locale: Joi.string().trim().allow('en', 'es').default('en'),
    }).default({ timezone: 'America/Chicago', format: 'MMM Do, YYYY', locale: 'en' }),
    language: Joi.object({
      primaryCode: Joi.string().trim().default('en'),
      subCode: Joi.string().trim().default('us'),
    }).default({ primaryCode: 'en', subCode: 'us' }),
    config: Joi.alternatives().try(Joi.object().unknown(), Joi.function()).default({}),
  }).required(),
  tenant: Joi.object({
    key: Joi.string().trim().pattern(/^[a-z0-9]+_[a-z0-9]+$/).required(),
  }).required(),
  trustProxy: Joi.array().items(Joi.string().trim()).default(['loopback', 'linklocal', 'uniquelocal']),
}).required();
