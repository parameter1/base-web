const { getAsObject, wrap } = require('@parameter1/base-web-object-path');

module.exports = ({
  baseCMSGraphQLClient,
  operationBuilder,
  queryFragment,
  variables,
  resultField,
} = {}) => {
  let promise;

  const load = async () => {
    if (!promise) {
      const path = `data.${resultField}`;
      const query = operationBuilder({ queryFragment });
      promise = baseCMSGraphQLClient.query({ query, variables })
        .then((r) => wrap(getAsObject(r, path)));
    }
    return promise;
  };

  const toObject = async () => {
    const resolved = await load();
    return resolved.unwrap();
  };
  return { load, toObject };
};
