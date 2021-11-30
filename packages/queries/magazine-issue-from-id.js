const gql = require('@parameter1/base-web-graphql-lib/tag');
const { extractData } = require('@parameter1/base-web-graphql-lib/fragment');

const defaultFragment = gql`
  fragment MagazineIssueFromIdBlockLoaderFragment on MagazineIssue {
    id
  }
`;

const buildGraphQLOperation = ({ queryFragment } = {}) => {
  const { spreadFragmentName, processedFragment } = extractData(queryFragment);
  return gql`
    query MagazineIssueFromIdBlockLoader($input: MagazineIssueQueryInput!) {
      magazineIssue(input: $input) {
        ...MagazineIssueFromIdBlockLoaderFragment
        ${spreadFragmentName}
      }
    }
    ${defaultFragment}
    ${processedFragment}
  `;
};

const executeQuery = async (baseCMSGraphQLClient, {
  id,
  queryFragment,
} = {}) => {
  const input = { id: parseInt(id, 10) };
  const { data } = await baseCMSGraphQLClient.query({
    query: buildGraphQLOperation({ queryFragment }),
    variables: { input },
  });
  return { node: data.magazineIssue || null };
};

module.exports = { defaultFragment, buildGraphQLOperation, executeQuery };
