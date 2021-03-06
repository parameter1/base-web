const gql = require('@parameter1/base-web-graphql-lib/tag');
const { extractData } = require('@parameter1/base-web-graphql-lib/fragment');

const defaultFragment = gql`
  fragment ContentFromIdBlockLoaderFragment on Content {
    id
    type
  }
`;

const buildGraphQLOperation = ({ queryFragment } = {}) => {
  const { spreadFragmentName, processedFragment } = extractData(queryFragment);
  return gql`
    query ContentFromIdBlockLoader($input: ContentQueryInput!) {
      content(input: $input) {
        ...ContentFromIdBlockLoaderFragment
        ${spreadFragmentName}
      }
    }
    ${defaultFragment}
    ${processedFragment}
  `;
};

const executeQuery = async (baseCMSGraphQLClient, {
  id,
  status = 'any',
  queryFragment,
} = {}) => {
  const input = { id: parseInt(id, 10), status };
  const { data } = await baseCMSGraphQLClient.query({
    query: buildGraphQLOperation({ queryFragment }),
    variables: { input },
  });
  return { node: data.content || null };
};

module.exports = { defaultFragment, buildGraphQLOperation, executeQuery };
