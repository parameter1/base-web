const Joi = require('@parameter1/joi');

module.exports = Joi.object({
  compat: Joi.object({
    enabled: Joi.boolean().truthy('1').falsy('0').default(false),
  }).default({ enabled: false }),
  components: Joi.object().unknown().external((v) => (v || {})),
  document: Joi.any(),
  fragments: Joi.object().unknown().external((v) => (v || {})),
  hooks: Joi.object({
    onAsyncBlockError: Joi.function(),
  }),
}).required();
