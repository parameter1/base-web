const gql = require('@parameter1/base-web-graphql-lib/tag');
const { extractData } = require('@parameter1/base-web-graphql-lib/fragment');

const defaultFragment = gql`
  fragment WebsiteSectionAliasBlockLoaderFragment on WebsiteSection {
    id
    alias
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

module.exports = { defaultFragment, buildGraphQLOperation };
