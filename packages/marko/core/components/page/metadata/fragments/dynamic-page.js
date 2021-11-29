const gql = require('@parameter1/base-web-graphql-lib/tag');

module.exports = gql`
  fragment DynamicPageMetadataFragment on ContentPage {
    id
    siteContext {
      path
      canonicalUrl
      noIndex
    }
    metadata {
      title
      description
    }
  }
`;
