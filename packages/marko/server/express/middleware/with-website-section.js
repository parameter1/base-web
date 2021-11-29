const { deprecated } = require('@parameter1/base-web-marko-server-common/deprecate');
const websiteSectionFromAlias = require('../route-handlers/website-section-from-alias');

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
