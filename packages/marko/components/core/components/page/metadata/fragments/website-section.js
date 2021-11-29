const gql = require('@parameter1/base-web-graphql-lib/tag');

module.exports = gql`
  fragment WebsiteSectionPageMetadataFragment on WebsiteSection {
    id
    canonicalPath
    metadata {
      title
      description
    }
  }
`;
