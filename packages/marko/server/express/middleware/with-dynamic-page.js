const { deprecated } = require('@parameter1/base-web-marko-server-common/deprecate');
const dynamicPageFromAlias = require('../route-handlers/dynamic-page-from-alias');

module.exports = deprecated(({
  template,
  queryFragment,
  aliasResolver,
  redirectOnPathMismatch = true,
} = {}) => dynamicPageFromAlias({
  template,
  aliasResolver,
  nodeQueryFragment: queryFragment,
  redirectOnPathMismatch,
}), 'middleware.withDynamicPage', 'route-handlers.dynamicPageFromAlias');
