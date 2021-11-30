const gql = require('@parameter1/base-web-graphql-lib/tag');
const { extractData } = require('@parameter1/base-web-graphql-lib/fragment');

const defaultFragment = gql`
  fragment MagazinePublicationsBlockLoaderFragment on MagazinePublication {
    id
    name
    description
    canonicalPath
  }
`;

const buildGraphQLOperation = ({ queryFragment } = {}) => {
  const { spreadFragmentName, processedFragment } = extractData(queryFragment);
  return gql`
    query MagazinePublicationsBlockLoader($input: MagazinePublicationsQueryInput!) {
      magazinePublications(input: $input) {
        edges {
          node {
            ...MagazinePublicationsBlockLoaderFragment
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
  publicationIds,

  queryFragment,
} = {}) => {
  const input = { publicationIds };
  const query = buildGraphQLOperation({ queryFragment });
  const variables = { input };

  const { data } = await baseCMSGraphQLClient.query({ query, variables });
  if (!data || !data.magazinePublications) return { nodes: [], pageInfo: {} };
  const { pageInfo } = data.magazinePublications;
  const nodes = data.magazinePublications.edges.reduce((arr, edge) => {
    if (edge && edge.node) arr.push(edge.node);
    return arr;
  }, []);
  return { nodes, pageInfo };
};

module.exports = { defaultFragment, buildGraphQLOperation, executeQuery };
