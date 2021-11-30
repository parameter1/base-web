const gql = require('@parameter1/base-web-graphql-lib/tag');
const { extractData } = require('@parameter1/base-web-graphql-lib/fragment');

const defaultFragment = gql`
  fragment MagazineLatestIssueFromIdBlockLoaderFragment on MagazineIssue {
    id
    name
    canonicalPath
  }
`;

const buildGraphQLOperation = ({ queryFragment } = {}) => {
  const { spreadFragmentName, processedFragment } = extractData(queryFragment);
  return gql`
    query MagazineLatestIssueFromIdBlockLoader($input: MagazineLatestIssueQueryInput!) {
      magazineLatestIssue(input: $input) {
        ...MagazineLatestIssueFromIdBlockLoaderFragment
        ${spreadFragmentName}
      }
    }
    ${defaultFragment}
    ${processedFragment}
  `;
};

const executeQuery = async (baseCMSGraphQLClient, {
  publicationId,
  requiresCoverImage,

  queryFragment,
} = {}) => {
  const input = { publicationId, requiresCoverImage };
  const { data } = await baseCMSGraphQLClient.query({
    query: buildGraphQLOperation({ queryFragment }),
    variables: { input },
  });
  return { node: data.magazineLatestIssue || null };
};

module.exports = { defaultFragment, buildGraphQLOperation, executeQuery };
