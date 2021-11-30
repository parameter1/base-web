const Joi = require('@parameter1/joi');

module.exports = Joi.object({
  compat: Joi.object({
    enabled: Joi.boolean().truthy('1').falsy('0').default(false),
  }).default(),
  components: Joi.object().unknown().external((v) => (v || {})),
  document: Joi.any(),
  embeddedMedia: Joi.object({
    handlers: Joi.object({
      image: Joi.function(),
      invalid: Joi.function(),
      oembed: Joi.function(),
    }),
  }),
  error: Joi.object({
    template: Joi.any(),
    asyncBlockNotifier: Joi.function(),
  }),
  fragments: Joi.object().unknown().external((v) => (v || {})),
  oembed: Joi.object({
    mountPoint: Joi.string().trim().default('/__oembed'),
    uri: Joi.string().trim().required(),
  }).default(),
}).required();
