const gql = require('@parameter1/base-web-graphql-lib/tag');

const query = gql`
  query WebsiteRedirect($input: WebsiteRedirectQueryInput!) {
    websiteRedirect(input: $input) {
      to
      code
    }
  }
`;

/**
 *
 * @param {object} params
 * @param {object} params.baseCMSGraphQLClient The BaseCMS GraphQL client
 * @param {string} params.from The request from path
 * @param {object} [params.queryParams] The request query string object
 * @returns {object|null}
 */
module.exports = async ({
  baseCMSGraphQLClient,
  from,
  queryParams,
} = {}) => {
  const variables = { input: { from, params: queryParams } };
  const { data } = await baseCMSGraphQLClient.query({ query, variables });
  const { websiteRedirect } = data;
  const { to } = websiteRedirect || {};
  return to ? websiteRedirect : null;
};
