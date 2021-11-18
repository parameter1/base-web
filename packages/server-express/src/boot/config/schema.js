const Joi = require('@parameter1/joi');

module.exports = Joi.object({
  // the internal host to run the server on
  host: Joi.string().trim().default('localhost'),
  // the external/exposed host
  exposedHost: Joi.string().trim().default((parent) => parent.host),
  // the internal port to run the server on
  port: Joi.number().port().default(45893),
  // the external/exposed port
  exposedPort: Joi.number().port().default((parent) => parent.port),
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
