import Joi from '@parameter1/joi';

export default Joi.object({
  app: Joi.object({
    name: Joi.string().trim().required(),
    version: Joi.string().trim().required(),
  }).required(),
  baseBrowseGraphQL: Joi.object({
    enabled: Joi.boolean().truthy('1').falsy('0').default(true),
    prop: Joi.string().trim().default('$apolloBaseBrowse'),
    uri: Joi.string().trim().uri().required(),
  }).required(),
  baseCMSGraphQL: Joi.object({
    enabled: Joi.boolean().truthy('1').falsy('0').default(true),
    prop: Joi.string().trim().default('$apolloBaseCMS'),
    uri: Joi.string().trim().uri().required(),
    cacheResponses: Joi.boolean().truthy('1').falsy('0').default(true),
    cacheSiteContext: Joi.boolean().truthy('1').falsy('0').default(true),
  }).required(),
  cookie: Joi.object({
    enabled: Joi.boolean().truthy('1').falsy('0').default(true),
  }).default({ enabled: true }),
  etag: Joi.object({
    enabled: Joi.boolean().truthy('1').falsy('0').default(true),
    mode: Joi.string().trim().lowercase().valid('weak', 'strong')
      .default('weak'),
  }).default({ enabled: true, mode: 'weak' }),
  helmet: Joi.object({
    enabled: Joi.boolean().truthy('1').falsy('0').default(true),
  }).unknown().default({ enabled: true }),
  routes: Joi.function().minArity(1).required(),
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
      locale: Joi.string().trim().default('en'),
    }).default({ timezone: 'America/Chicago', format: 'MMM Do, YYYY', locale: 'en' }),
    language: Joi.object({
      primaryCode: Joi.string().trim().default('en'),
      subCode: Joi.string().trim().default('us'),
    }).default({ primaryCode: 'en', subCode: 'us' }),
    config: Joi.object().unknown().default(), // @todo wrap with getters
  }).required(),
  tenant: Joi.object({
    key: Joi.string().trim().pattern(/^[a-z0-9]+_[a-z0-9]+$/).required(),
  }).required(),
  trustProxy: Joi.array().items(Joi.string().trim()).default(['loopback', 'linklocal', 'uniquelocal']),
}).required();
