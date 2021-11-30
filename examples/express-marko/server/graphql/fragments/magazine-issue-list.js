const gql = require('@parameter1/base-web-graphql-lib/tag');

module.exports = gql`

fragment MagazineIssueListFragment on MagazineIssue {
  id
  name
}

`;
