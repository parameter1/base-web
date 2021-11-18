const fetch = require('node-fetch');

module.exports = async ({ uri, headers } = {}) => {
  if (!uri) throw new Error('A GraphQL URI is required to generate possibe types.');
  const res = await fetch(uri, {
    method: 'POST',
    headers: { 'content-type': 'application/json', ...headers },
    body: JSON.stringify({
      variables: {},
      query: '{ __schema { types { kind name possibleTypes { name } } } }',
    }),
  });

  const { data } = await res.json();
  const possibleTypes = {};
  // eslint-disable-next-line no-underscore-dangle
  data.__schema.types.forEach((supertype) => {
    if (supertype.possibleTypes) {
      possibleTypes[supertype.name] = supertype.possibleTypes.map((subtype) => subtype.name);
    }
  });
  return possibleTypes;
};
