const { isFunction: isFn } = require('@parameter1/base-web-utils');
const { magazineIssueFromId } = require('@parameter1/base-web-server-express/route-handlers');

const maybeDeprecate = (marko, data) => {
  if (!marko.get('compat.enabled')) return data;
  process.emitWarning('Directly accessing issue props (id, etc) within templates is deprecated. Use input.routeData[prop] instead.', { code: 'compat:input.routeData[prop]', type: 'DeprecationWarning' });
  return { ...data.routeData, ...data };
};

module.exports = ({
  template,
  render,

  nodeQueryFragment,
  loaderQueryFragment,
} = {}) => magazineIssueFromId({
  render: isFn(render) ? render : async ({ res, node, issue }) => {
    const { marko } = res.app.locals;
    res.marko(template, maybeDeprecate(marko, { routeData: issue, pageNode: node }));
  },
  nodeQueryFragment,
  loaderQueryFragment,
});
