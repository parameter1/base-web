const gql = require('@parameter1/base-web-graphql-lib/tag');
const { cleanPath } = require('@parameter1/base-web-utils');
const { get } = require('@parameter1/base-web-object-path');
const getPreviewModeInput = require('../input-builders/content-preview-mode');

const query = gql`
  query WebsiteContentPageAlias($input: ContentAliasQueryInput!) {
    contentAlias(input: $input) {
      id
      siteContext {
        path
      }
    }
  }
`;

/**
 *
 * @param {object} params
 * @param {object} params.baseCMSClient The BaseCMS GraphQL client
 * @param {string} params.from The request from path
 * @param {boolean} params.previewModeEnabled Whether contet preview mode is active.
 * @returns {string|null}
 */
module.exports = async ({
  baseCMSClient,
  from,
  previewModeEnabled = false,
} = {}) => {
  const alias = cleanPath(from);
  if (!alias) return null;
  const input = getPreviewModeInput({
    input: { alias },
    enabled: previewModeEnabled,
  });
  const variables = { input };
  const { data } = await baseCMSClient.query({ query, variables });
  return get(data, 'contentAlias.siteContext.path');
};
