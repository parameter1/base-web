const gql = require('@parameter1/base-web-graphql-lib/tag');
const { extractData } = require('@parameter1/base-web-graphql-lib/fragment');

const defaultFragment = gql`
  fragment MagazinePublicationFromIdBlockLoaderFragment on MagazinePublication {
    id
  }
`;

const buildGraphQLOperation = ({ queryFragment } = {}) => {
  const { spreadFragmentName, processedFragment } = extractData(queryFragment);
  return gql`
    query MagazinePublicationFromIdBlockLoader($input: MagazinePublicationQueryInput!) {
      magazinePublication(input: $input) {
        ...MagazinePublicationFromIdBlockLoaderFragment
        ${spreadFragmentName}
      }
    }
    ${defaultFragment}
    ${processedFragment}
  `;
};

const executeQuery = async (baseCMSGraphQLClient, {
  id,
  queryFragment,
} = {}) => {
  const input = { id };
  const { data } = await baseCMSGraphQLClient.query({
    query: buildGraphQLOperation({ queryFragment }),
    variables: { input },
  });
  return { node: data.magazinePublication || null };
};

module.exports = { defaultFragment, buildGraphQLOperation, executeQuery };
