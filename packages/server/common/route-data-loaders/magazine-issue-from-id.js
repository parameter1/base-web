const createError = require('http-errors');
const { extractData } = require('@parameter1/base-web-graphql-lib/fragment');
const gql = require('@parameter1/base-web-graphql-lib/tag');
const { buildGraphQLOperation: buildIssueOperation } = require('@parameter1/base-web-queries/magazine-issue-from-id');
const RouteDataNode = require('./-node');

const defaultFragment = gql`
  fragment MagazineIssueRouteDataFromIdFragment on MagazineIssue {
    id
    canonicalPath
    publication {
      id
      name
    }
    metadata {
      title
      description
    }
  }
`;

const buildGraphQLOperation = ({ fragment } = {}) => {
  const { spreadFragmentName, processedFragment } = extractData(fragment);
  return gql`
    query MagazineIssueRouteDataFromId($input: MagazineIssueQueryInput!) {
      magazineIssue(input: $input) {
        ...MagazineIssueRouteDataFromIdFragment
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
  const input = { ...additionalInput, id: parseInt(id, 10) };
  if (!input.id) throw createError(400, 'No magazine issue ID was provided.');
  const { data } = await baseCMSGraphQLClient.query({
    query: buildGraphQLOperation({ fragment }),
    variables: { input },
  });
  const { magazineIssue } = data;
  if (!magazineIssue || !magazineIssue.id) throw createError(404, `No magazine issue was found for id '${id}'`);
  return magazineIssue;
};

module.exports = async ({
  baseCMSGraphQLClient,
  id,
  additionalInput,
  nodeQueryFragment,
  loaderQueryFragment,
} = {}) => {
  const issue = await executeQuery({
    baseCMSGraphQLClient,
    id,
    additionalInput,
    fragment: loaderQueryFragment,
  });

  const node = RouteDataNode({
    baseCMSGraphQLClient,
    variables: { input: { ...additionalInput, id: issue.id } },
    operationBuilder: buildIssueOperation,
    queryFragment: nodeQueryFragment,
    resultField: 'magazineIssue',
  });
  return { node, issue };
};
