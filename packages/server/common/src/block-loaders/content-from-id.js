const gql = require('@parameter1/base-web-graphql-lib/tag');
const { extractData } = require('@parameter1/base-web-graphql-lib/fragment');

const defaultFragment = gql`
  fragment ContentFromIdBlockLoaderFragment on Content {
    id
    type
  }
`;

const buildGraphQLOperation = ({ fragment } = {}) => {
  const { spreadFragmentName, processedFragment } = extractData(fragment);
  return gql`
    query ContentFromIdBlockLoader($input: ContentQueryInput!) {
      content(input: $input) {
        ...ContentFromIdBlockLoaderFragment
        ${spreadFragmentName}
      }
    }
    ${defaultFragment}
    ${processedFragment}
  `;
};

module.exports = { defaultFragment, buildGraphQLOperation };
