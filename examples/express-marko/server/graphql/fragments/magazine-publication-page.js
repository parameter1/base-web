const gql = require('@parameter1/base-web-graphql-lib/tag');

module.exports = gql`
  fragment MagazinePublicationPageFragment on MagazinePublication {
    id
    name
    description
    canonicalPath
  }
`;
