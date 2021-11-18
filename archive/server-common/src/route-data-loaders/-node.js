import { getAsObject, wrap } from '@parameter1/base-web-object-path';

export default ({
  graphqlClient,
  operationBuilder,
  fragment,
  variables,
  resultField,
} = {}) => {
  let promise;

  const load = async () => {
    if (!promise) {
      const path = `data.${resultField}`;
      const query = operationBuilder({ fragment });
      promise = graphqlClient.query({ query, variables }).then((r) => wrap(getAsObject(r, path)));
    }
    return promise;
  };

  const toObject = async () => {
    const resolved = await load();
    return resolved.unwrap();
  };
  return { load, toObject };
};
