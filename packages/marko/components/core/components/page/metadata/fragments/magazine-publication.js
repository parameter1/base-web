const gql = require('@parameter1/base-web-graphql-lib/tag');

module.exports = gql`
  fragment MagazinePublicationMetadataFragment on MagazinePublication {
    id
    canonicalPath
    metadata {
      title
      description
    }
  }
`;
