const gql = require('@parameter1/base-web-graphql-lib/tag');
const { extractData } = require('@parameter1/base-web-graphql-lib/fragment');

module.exports = ({ fragment }) => {
  const { spreadFragmentName, processedFragment } = extractData(fragment);
  return gql`
    fragment ContentPageMetadataFragment on Content {
      id
      type
      siteContext {
        url
        path
        canonicalUrl
        noIndex
      }
      published
      updated
      metadata {
        title
        description
        publishedDate
        updatedDate
        expiresDate
        image {
          id
          src(input: { options: { auto: "format,compress", w: "1200", fit: "max", q: 70 } })
        }
      }
      ... on ContentVideo {
        embedSrc
      }
      ... on ContentPodcast {
        fileSrc
        fileName
      }
      ... on Authorable {
        authors {
          edges {
            node {
              id
              name
            }
          }
        }
      }
      ... on Addressable {
        address1
        address2
        city
        state
        zip
        country
      }
      ... on Contactable {
        phone
        tollfree
        fax
        website
        title
        mobile
        publicEmail
      }
      ... on ContentCompany {
        email
      }
      images(input:{ pagination: { limit: 0 }, sort: { order: values } }) {
        edges {
          node {
            id
            src(input: { options: { auto: "format,compress", w: "1200", fit: "max", q: 70 } })
          }
        }
      }
      ${spreadFragmentName}
    }
    ${processedFragment}
  `;
};
