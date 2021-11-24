const gql = require('@parameter1/base-web-graphql-lib/tag');

module.exports = gql`
fragment WebsiteSectionPageFragment on WebsiteSection {
  id
  name
  alias
  fullName
  description
  hierarchy {
    id
    alias
    name
  }
}
`;
