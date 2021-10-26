import { extractFragmentData, gql } from '@parameter1/base-web-graphql';

export const defaultFragment = gql`
  fragment WebsiteSectionAliasBlockLoaderFragment on WebsiteSection {
    id
    alias
  }
`;

export function buildGraphQLOperation({ fragment } = {}) {
  const { spreadFragmentName, processedFragment } = extractFragmentData(fragment);
  return gql`
    query WebsiteSectionAliasBlockLoader($input: WebsiteSectionAliasQueryInput!) {
      section: websiteSectionAlias(input: $input) {
        ...WebsiteSectionAliasBlockLoaderFragment
        ${spreadFragmentName}
      }
    }
    ${defaultFragment}
    ${processedFragment}
  `;
}
