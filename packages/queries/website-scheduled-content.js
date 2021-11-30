const gql = require('@parameter1/base-web-graphql-lib/tag');
const { extractData } = require('@parameter1/base-web-graphql-lib/fragment');
const date = require('./utils/date');

const defaultFragment = gql`
  fragment WebsiteScheduledContentBlockLoaderFragment on Content {
    id
    type
    siteContext {
      path
    }
  }
`;

const buildGraphQLOperation = ({ queryFragment, sectionFragment } = {}) => {
  const { spreadFragmentName, processedFragment } = extractData(queryFragment);
  const {
    spreadFragmentName: spreadSectionFragment,
    processedFragment: processedSectionFragment,
  } = extractData(sectionFragment);
  return gql`
    query WebsiteScheduledContentBlockLoader($input: WebsiteScheduledContentQueryInput!) {
      websiteScheduledContent(input: $input) {
        section {
          id
          ${spreadSectionFragment}
        }
        edges {
          node {
            ...WebsiteScheduledContentBlockLoaderFragment
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
    ${processedSectionFragment}
  `;
};

const executeQuery = async (baseCMSGraphQLClient, {
  limit,
  skip,
  after,
  sort,

  siteId,
  sectionId,
  sectionAlias,
  optionId,
  optionName,
  beginningAfter,
  beginningBefore,
  endingAfter,
  endingBefore,

  excludeContentIds,
  excludeContentTypes,
  includeContentTypes,

  includeLabels,
  excludeLabels,

  requiresImage,
  sectionBubbling,

  queryFragment,
  sectionFragment,
} = {}) => {
  const pagination = { limit, skip, after };
  const input = {
    pagination,
    excludeContentIds,
    excludeContentTypes,
    includeContentTypes,
    includeLabels,
    excludeLabels,
    requiresImage,
    sectionAlias,
    sectionBubbling,
    siteId,
    sectionId,
    optionId,
    optionName,
    beginning: { after: date(beginningAfter), before: date(beginningBefore) },
    ending: { after: date(endingAfter), before: date(endingBefore) },
    ...(sort && { sort }),
  };
  const query = buildGraphQLOperation({ queryFragment, sectionFragment });
  const variables = { input };

  const { data } = await baseCMSGraphQLClient.query({ query, variables });
  if (!data || !data.websiteScheduledContent) return { nodes: [], pageInfo: {} };
  const { pageInfo, section } = data.websiteScheduledContent;
  const nodes = data.websiteScheduledContent.edges.reduce((arr, edge) => {
    if (edge && edge.node) arr.push(edge.node);
    return arr;
  }, []);
  return { nodes, pageInfo, section };
};

module.exports = { defaultFragment, buildGraphQLOperation, executeQuery };
