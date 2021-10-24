import Joi from '@parameter1/joi';

export default Joi.object({
  app: Joi.object({
    name: Joi.string().trim().required(),
    version: Joi.string().trim().required(),
  }).required(),
  baseCMSGraphQL: Joi.object({
    url: Joi.string().trim().uri().required(),
    cacheResponses: Joi.boolean().truthy('1').falsy('0'),
  }).required(),
  site: Joi.object({
    id: Joi.string().trim().pattern(/^[a-f0-9]{24}$/).required(),
    name: Joi.string().trim().required(),
    description: '',
    host: '',
    imageHost: '',
    assetHost: '',
    date: {},
    language: {},
    config: Joi.object().unknown().default(), // @todo wrap with getters
  }).required(),
  tenant: Joi.object({
    key: Joi.string().trim().pattern(/^[a-z0-9]+_[a-z0-9]+$/).required(),
  }).required(),
}).required();
