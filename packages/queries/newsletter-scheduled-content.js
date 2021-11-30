const gql = require('@parameter1/base-web-graphql-lib/tag');
const { extractData } = require('@parameter1/base-web-graphql-lib/fragment');

const defaultFragment = gql`
  fragment NewsletterScheduledContentBlockLoaderFragment on Content {
    id
    type
    name(input: { mutation: Email })
    siteContext {
      url
    }
  }
`;

const buildGraphQLOperation = ({ queryFragment } = {}) => {
  const { spreadFragmentName, processedFragment } = extractData(queryFragment);
  return gql`
    query NewsletterScheduledContentBlockLoader($input: NewsletterScheduledContentQueryInput!) {
      newsletterScheduledContent(input: $input) {
        ...NewsletterScheduledContentBlockLoaderFragment
        ${spreadFragmentName}
      }
    }
    ${defaultFragment}
    ${processedFragment}
  `;
};

const executeQuery = async (baseCMSGraphQLClient, {
  limit,
  skip,

  newsletterId,
  sectionId,
  sectionName,

  date,
  timezone,
  ignoreStartDate,

  excludeContentTypes,
  includeContentTypes,

  queryFragment,
} = {}) => {
  const input = {
    newsletterId,
    sectionId,
    sectionName,
    date: date instanceof Date ? date.valueOf() : date,
    timezone,
    ignoreStartDate,
    excludeContentTypes,
    includeContentTypes,
    limit,
    skip,
  };
  const query = buildGraphQLOperation({ queryFragment });
  const variables = { input };

  const { data } = await baseCMSGraphQLClient.query({ query, variables });
  if (!data || !data.newsletterScheduledContent) return { nodes: [] };
  return { nodes: data.newsletterScheduledContent };
};

module.exports = { defaultFragment, buildGraphQLOperation, executeQuery };
