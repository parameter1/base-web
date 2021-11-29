const gql = require('@parameter1/base-web-graphql-lib/tag');

module.exports = gql`
fragment DynamicPageFragment on ContentPage {
  id
  name
  body
}
`;
