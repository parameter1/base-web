const gql = require('@parameter1/base-web-graphql-lib/tag');

module.exports = gql`
  fragment MagazineIssuePageFragment on MagazineIssue {
    id
    name
    description
    digitalEditionUrl
    canonicalPath
    coverImage {
      id
      src(input: { options: { auto: "format,compress" } })
    }
    publication {
      id
      name
      subscribeUrl
      canonicalPath
    }
  }
`;
