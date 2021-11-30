const gql = require('@parameter1/base-web-graphql-lib/tag');
const { extractData } = require('@parameter1/base-web-graphql-lib/fragment');
const date = require('./utils/date');

const defaultFragment = gql`
  fragment AllPublishedContentBlockLoaderFragment on Content {
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
    query AllPublishedContentBlockLoader($input: AllPublishedContentQueryInput!) {
      allPublishedContent(input: $input) {
        edges {
          node {
            ...AllPublishedContentBlockLoaderFragment
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

  since,
  publishedAfter,
  beginningAfter,
  beginningBefore,
  endingAfter,
  endingBefore,

  sortField: field,
  sortOrder: order,

  includeContentTypes,
  excludeContentTypes,

  includeTaxonomyIds,

  includeLabels,

  excludeContentIds,

  sectionId,
  contentTypes,
  withSite,
  requiresImage,
  sectionBubbling,

  queryFragment,
} = {}) => {
  const pagination = { limit, skip, after };
  const input = {
    pagination,
    includeContentTypes: includeContentTypes || contentTypes,
    excludeContentTypes,
    includeTaxonomyIds,
    includeLabels,
    excludeContentIds,
    withSite,
    requiresImage,
    sectionBubbling,
    sectionId,
    since: date(since),
    beginning: { after: date(beginningAfter), before: date(beginningBefore) },
    ending: { after: date(endingAfter), before: date(endingBefore) },
    ...(publishedAfter && { after: date(publishedAfter) }),
  };
  if (field || order) input.sort = { field, order };
  const query = buildGraphQLOperation({ queryFragment });
  const variables = { input };

  const { data } = await baseCMSGraphQLClient.query({ query, variables });
  if (!data || !data.allPublishedContent) return { nodes: [], pageInfo: {} };
  const { pageInfo } = data.allPublishedContent;
  const nodes = data.allPublishedContent.edges.reduce((arr, edge) => {
    if (edge && edge.node) arr.push(edge.node);
    return arr;
  }, []);
  return { nodes, pageInfo };
};

module.exports = { defaultFragment, buildGraphQLOperation, executeQuery };
