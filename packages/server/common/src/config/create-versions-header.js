/**
 *
 */
module.exports = ({ conf, pkg } = {}) => ['X-Versions', `site=${conf.get('app.version')}; core=${pkg.version}`];
