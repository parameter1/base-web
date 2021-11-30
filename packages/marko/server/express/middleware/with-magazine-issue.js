const { deprecated } = require('@parameter1/base-web-marko-server-common/deprecate');
const magazineIssueFromId = require('../route-handlers/magazine-issue-from-id');

module.exports = deprecated(({
  template,
  queryFragment,
} = {}) => magazineIssueFromId({
  template,
  nodeQueryFragment: queryFragment,
}), 'middleware.withMagazineIssue', 'route-handlers.magazineIssueFromId');
