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
}).required();
