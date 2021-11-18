/**
 *
 */
export default ({ conf, pkg } = {}) => ['X-Versions', `site=${conf.get('app.version')}; core=${pkg.version}`];
