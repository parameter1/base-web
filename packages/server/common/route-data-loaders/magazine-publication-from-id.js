const createError = require('http-errors');
const { extractData } = require('@parameter1/base-web-graphql-lib/fragment');
const gql = require('@parameter1/base-web-graphql-lib/tag');
const { buildGraphQLOperation: buildPublicationOperation } = require('@parameter1/base-web-queries/magazine-publication-from-id');
const RouteDataNode = require('./-node');

const defaultFragment = gql`
  fragment MagazinePublicationRouteDataFromIdFragment on MagazinePublication {
    id
    canonicalPath
    metadata {
      title
      description
    }
  }
`;

const buildGraphQLOperation = ({ fragment } = {}) => {
  const { spreadFragmentName, processedFragment } = extractData(fragment);
  return gql`
    query MagazinePublicationRouteDataFromId($input: MagazinePublicationQueryInput!) {
      magazinePublication(input: $input) {
        ...MagazinePublicationRouteDataFromIdFragment
        ${spreadFragmentName}
      }
    }
    ${defaultFragment}
    ${processedFragment}
  `;
};

const executeQuery = async ({
  baseCMSGraphQLClient,
  id,
  additionalInput,
  fragment,
} = {}) => {
  const input = { ...additionalInput, id };
  if (!input.id) throw createError(400, 'No magazine publication ID was provided.');
  const { data } = await baseCMSGraphQLClient.query({
    query: buildGraphQLOperation({ fragment }),
    variables: { input },
  });
  const { magazinePublication } = data;
  if (!magazinePublication || !magazinePublication.id) throw createError(404, `No magazine publication was found for id '${id}'`);
  return magazinePublication;
};

module.exports = async ({
  baseCMSGraphQLClient,
  id,
  additionalInput,
  nodeQueryFragment,
  loaderQueryFragment,
} = {}) => {
  const publication = await executeQuery({
    baseCMSGraphQLClient,
    id,
    additionalInput,
    fragment: loaderQueryFragment,
  });

  const node = RouteDataNode({
    baseCMSGraphQLClient,
    variables: { input: { ...additionalInput, id: publication.id } },
    operationBuilder: buildPublicationOperation,
    queryFragment: nodeQueryFragment,
    resultField: 'magazinePublication',
  });
  return { node, publication };
};
