const gql = require('@parameter1/base-web-graphql-lib/tag');

module.exports = gql`
  fragment MagazineIssueMetadataFragment on MagazineIssue {
    id
    canonicalPath
    metadata {
      title
      description
    }
  }
`;
