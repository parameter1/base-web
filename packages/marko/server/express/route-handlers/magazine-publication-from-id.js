const { isFunction: isFn } = require('@parameter1/base-web-utils');
const { magazinePublicationFromId } = require('@parameter1/base-web-server-express/route-handlers');

const maybeDeprecate = (marko, data) => {
  if (!marko.get('compat.enabled')) return data;
  process.emitWarning('Directly accessing publication props (id, etc) within templates is deprecated. Use input.routeData[prop] instead.', { code: 'compat:input.routeData[prop]', type: 'DeprecationWarning' });
  return { ...data.routeData, ...data };
};

module.exports = ({
  template,
  render,

  nodeQueryFragment,
  loaderQueryFragment,
} = {}) => magazinePublicationFromId({
  render: isFn(render) ? render : async ({ res, node, publication }) => {
    const { marko } = res.app.locals;
    res.marko(template, maybeDeprecate(marko, { routeData: publication, pageNode: node }));
  },
  nodeQueryFragment,
  loaderQueryFragment,
});
