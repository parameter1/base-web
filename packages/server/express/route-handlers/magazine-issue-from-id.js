const { magazineIssueRouteDataFromId } = require('@parameter1/base-web-server-common/route-data-loaders');
const { isFunction: isFn } = require('@parameter1/base-web-utils');
const asyncRoute = require('../utils/async-route');

module.exports = ({
  render,
  nodeQueryFragment,
  loaderQueryFragment,
} = {}) => asyncRoute(async (req, res) => {
  const { baseCMSGraphQLClient } = req.app.locals;
  const { node, issue } = await magazineIssueRouteDataFromId({
    baseCMSGraphQLClient,
    id: req.params.id,
    nodeQueryFragment,
    loaderQueryFragment,
  });
  if (isFn(render)) {
    return render({
      req,
      res,
      node,
      issue,
    });
  }
  return { node, issue };
});
