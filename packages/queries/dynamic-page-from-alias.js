const gql = require('@parameter1/base-web-graphql-lib/tag');
const { extractData } = require('@parameter1/base-web-graphql-lib/fragment');

const defaultFragment = gql`
  fragment DyanmicPageFromAliasBlockLoaderFragment on ContentPage {
    id
    alias
  }
`;

const buildGraphQLOperation = ({ queryFragment } = {}) => {
  const { spreadFragmentName, processedFragment } = extractData(queryFragment);
  return gql`
    query DynamicPageFromAliasBlockLoader($input: ContentPageQueryInput!) {
      page: contentPage(input: $input) {
        ...DyanmicPageFromAliasBlockLoaderFragment
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
  return { node: data.page || null };
};

module.exports = { defaultFragment, buildGraphQLOperation, executeQuery };
