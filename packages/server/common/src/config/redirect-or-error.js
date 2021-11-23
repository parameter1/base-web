const { isFunction: isFn } = require('@parameter1/base-web-utils');
const { set } = require('@parameter1/base-web-object-path');
const { contentByAlias, websiteRedirect } = require('../graphql/queries');
const { formatGraphQLError } = require('../errors');

const redirectHeaders = (code) => {
  if ([302, 307].includes(code)) {
    return [
      { key: 'Surrogate-Control', value: 'no-store' },
      { key: 'Cache-Control', value: 'no-store, no-cache, must-revalidate, proxy-revalidate' },
      { key: 'Pragma', value: 'no-cache' },
      { key: 'Expires', value: '0' },
    ];
  }
  return [];
};

const findRedirect = async ({
  baseCMSClient,
  conf,
  path,
  cookies,
  headers,
  queryParams,
  contentPreviewModeEnabled,

  customRedirectHandler,
} = {}) => {
  const from = path.replace(/\/$/, '');
  const [redirect, contentAlias] = await Promise.all([
    websiteRedirect({ baseCMSClient, from, queryParams }),
    contentByAlias({ baseCMSClient, from, previewModeEnabled: contentPreviewModeEnabled }),
  ]);
  if (contentAlias) return { to: contentAlias, code: 301, headers: redirectHeaders() };
  if (redirect) return { ...redirect, headers: redirectHeaders(redirect.code) };
  if (!isFn(customRedirectHandler)) return null;
  return customRedirectHandler({
    from,
    conf,
    cookies,
    headers,
    baseCMSClient,
    queryParams,
  });
};

module.exports = async ({
  error,
  conf,
  baseCMSClient,
  path,
  queryParams,
  cookies,
  headers,
  contentPreviewModeEnabled,
  customRedirectHandler,
} = {}) => {
  const err = formatGraphQLError(error);
  set(err, 'status', err.status || err.statusCode || 500);
  if (err.status === 404) {
    const redirect = await findRedirect({
      baseCMSClient,
      conf,
      path,
      cookies,
      headers,
      queryParams,
      contentPreviewModeEnabled,
      customRedirectHandler,
    });
    return { redirect, error: err };
  }
  return { error: err };
};
