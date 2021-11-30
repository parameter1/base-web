const { magazineIssueFromId, magazinePublicationFromId } = require('@parameter1/base-web-marko-server-express/route-handlers');
const publicationFragment = require('../graphql/fragments/magazine-publication-page');
const issueFragment = require('../graphql/fragments/magazine-issue-page');

const issue = require('../templates/magazine-issue.marko');
const publication = require('../templates/magazine-publication.marko');

module.exports = (server) => {
  server.get('/magazine/:id([a-fA-F0-9]{24})', magazinePublicationFromId({
    template: publication,
    queryFragment: publicationFragment,
  }));

  server.get('/magazine/:id(\\d+)', magazineIssueFromId({
    template: issue,
    queryFragment: issueFragment,
  }));
};
