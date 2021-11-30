const { withMagazineIssue } = require('@parameter1/base-web-marko-server-express/middleware');
const issueFragment = require('../graphql/fragments/magazine-issue-page');
const issue = require('../templates/magazine-issue.marko');

module.exports = (server) => {
  server.get('/magazine/:id(\\d+)', withMagazineIssue({
    template: issue,
    queryFragment: issueFragment,
  }));
};
