const fetch = require('node-fetch');
const pkg = require('./package.json');
const GraphQLError = require('./error');

/**
 * Creates a GraphQL client.
 *
 * @param {object} params
 * @param {string} params.uri The GraphQL URI to connect to.
 * @param {string} [params.name] The client name.
 * @param {string} [params.version] The client version.
 * @param {object} [params.headers] Headers to send with all requests.
 * @returns {function}
 */
module.exports = ({
  uri,
  name,
  version,
  headers,
}) => {
  if (!uri) throw new Error('The GraphQL URI is required.');
  const via = [name, version].filter((v) => v).join('/');
  return {
    query: async ({ query, variables, headers: reqHeaders } = {}) => {
      if (!query) throw new Error('A query operation must be provided.');
      const res = await fetch(uri, {
        method: 'POST',
        headers: {
          ...headers,
          ...reqHeaders,
          'content-type': 'application/json',
          'user-agent': `${pkg.name}/${pkg.version}${via ? ` (via ${via})` : ''}`,
        },
        body: JSON.stringify({
          query: typeof query === 'string' ? query : query.loc.source.body,
          variables,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new GraphQLError(res, json);
      return json;
    },
  };
};
