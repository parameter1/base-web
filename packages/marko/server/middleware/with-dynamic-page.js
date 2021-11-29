const dynamicPageFromAlias = require('../route-handlers/dynamic-page-from-alias');
const { deprecated } = require('../deprecate');

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
