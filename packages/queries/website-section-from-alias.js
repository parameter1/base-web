const gql = require('@parameter1/base-web-graphql-lib/tag');
const { extractData } = require('@parameter1/base-web-graphql-lib/fragment');

const defaultFragment = gql`
  fragment WebsiteSectionAliasBlockLoaderFragment on WebsiteSection {
    id
    alias
    name
    canonicalPath
  }
`;

const buildGraphQLOperation = ({ queryFragment } = {}) => {
  const { spreadFragmentName, processedFragment } = extractData(queryFragment);
  return gql`
    query WebsiteSectionAliasBlockLoader($input: WebsiteSectionAliasQueryInput!) {
      section: websiteSectionAlias(input: $input) {
        ...WebsiteSectionAliasBlockLoaderFragment
        ${spreadFragmentName}
      }
    }
    ${defaultFragment}
    ${processedFragment}
  `;
};

const executeQuery = async (baseCMSGraphQLClient, {
  alias,
  queryFragment,
} = {}) => {
  const input = { alias };
  const { data } = await baseCMSGraphQLClient.query({
    query: buildGraphQLOperation({ queryFragment }),
    variables: { input },
  });
  return { node: data.section || null };
};

module.exports = { defaultFragment, buildGraphQLOperation, executeQuery };
