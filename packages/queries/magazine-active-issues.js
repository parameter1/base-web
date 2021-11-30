const gql = require('@parameter1/base-web-graphql-lib/tag');
const { extractData } = require('@parameter1/base-web-graphql-lib/fragment');

const defaultFragment = gql`
  fragment MagazineActiveIssuesBlockLoaderFragment on MagazineIssue {
    id
    name
    canonicalPath
  }
`;

const buildGraphQLOperation = ({ queryFragment } = {}) => {
  const { spreadFragmentName, processedFragment } = extractData(queryFragment);
  return gql`
    query MagazineActiveIssuesBlockLoader($input: MagazineActiveIssuesQueryInput!) {
      magazineActiveIssues(input: $input) {
        edges {
          node {
            ...MagazineActiveIssuesBlockLoaderFragment
            ${spreadFragmentName}
          }
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
    ${defaultFragment}
    ${processedFragment}
  `;
};

const executeQuery = async (baseCMSGraphQLClient, {
  publicationId,
  excludeIssueIds,
  requiresCoverImage,
  mailing,

  queryFragment,
  limit,
  skip,
  after,
  sort,
} = {}) => {
  const pagination = { limit, skip, after };
  const input = {
    publicationId,
    excludeIssueIds,
    requiresCoverImage,
    mailing,
    sort,
    pagination,
  };
  const query = buildGraphQLOperation({ queryFragment });
  const variables = { input };

  const { data } = await baseCMSGraphQLClient.query({ query, variables });
  if (!data || !data.magazineActiveIssues) return { nodes: [], pageInfo: {} };
  const { pageInfo } = data.magazineActiveIssues;
  const nodes = data.magazineActiveIssues.edges.reduce((arr, edge) => {
    if (edge && edge.node) arr.push(edge.node);
    return arr;
  }, []);
  return { nodes, pageInfo };
};

module.exports = { defaultFragment, buildGraphQLOperation, executeQuery };
