const gql = require('@parameter1/base-web-graphql-lib/tag');
const { extractData } = require('@parameter1/base-web-graphql-lib/fragment');

const defaultFragment = gql`
  fragment MagazineScheduledContentBlockLoaderFragment on Content {
    id
    type
    siteContext {
      path
    }
  }
`;

const buildGraphQLOperation = ({ queryFragment } = {}) => {
  const { spreadFragmentName, processedFragment } = extractData(queryFragment);
  return gql`
    query MagazineScheduledContentBlockLoader($input: MagazineScheduledContentQueryInput!) {
      magazineScheduledContent(input: $input) {
        edges {
          node {
            ...MagazineScheduledContentBlockLoaderFragment
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
  limit,
  skip,
  after,
  issueId,
  excludeContentIds,
  includeSectionNames,
  excludeSectionNames,
  sort,
  queryFragment,
} = {}) => {
  const pagination = { limit, skip, after };
  const input = {
    sort,
    pagination,
    issueId,
    excludeContentIds,
    includeSectionNames,
    excludeSectionNames,
  };
  const query = buildGraphQLOperation({ queryFragment });
  const variables = { input };

  const { data } = await baseCMSGraphQLClient.query({ query, variables });
  if (!data || !data.magazineScheduledContent) return { nodes: [], pageInfo: {} };
  const { pageInfo } = data.magazineScheduledContent;
  const nodes = data.magazineScheduledContent.edges.reduce((arr, edge) => {
    if (edge && edge.node) arr.push(edge.node);
    return arr;
  }, []);
  return { nodes, pageInfo };
};

module.exports = { defaultFragment, buildGraphQLOperation, executeQuery };
