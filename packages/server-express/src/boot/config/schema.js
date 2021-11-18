const Joi = require('@parameter1/joi');

module.exports = Joi.object({
  // server config object
  server: Joi.object().unknown().default({}),
  // path to run health checks on
  healthCheckPath: Joi.string().trim().default('/__health'),

  // terminus hooks
  onBoot: Joi.function(),
  onHealthCheck: Joi.function(),
  onSignal: Joi.function(),
  onShutdown: Joi.function(),
  beforeShutdown: Joi.function(),
  onError: Joi.function(),
}).required();
