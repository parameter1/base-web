const websiteSectionFromAlias = require('../route-handlers/website-section-from-alias');
const { deprecated } = require('../deprecate');

module.exports = deprecated(({
  template,
  queryFragment,
  aliasResolver,
  redirectOnPathMismatch = true,
  context,
} = {}) => websiteSectionFromAlias({
  template,
  aliasResolver,
  nodeQueryFragment: queryFragment,
  redirectOnPathMismatch,
  contextFn: context,
}), 'middleware.withWebsiteSection', 'route-handlers.websiteSectionFromAlias');
