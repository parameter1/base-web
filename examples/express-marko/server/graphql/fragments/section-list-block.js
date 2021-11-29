const gql = require('@parameter1/base-web-graphql-lib/tag');

module.exports = gql`

fragment SectionListBlockContentFragment on Content {
  id
  type
  shortName
  labels
  siteContext {
    path
  }
  primarySection {
    id
    name
    fullName
    canonicalPath
  }
}

`;
