const { asyncRoute } = require('@parameter1/base-web-marko-server-express/utils');
const { gql } = require('@parameter1/base-web-graphql-lib/tag');
const { jsonErrorHandler } = require('@parameter1/base-web-marko-server-express/middleware');
const content = require('./content');
const dynamicPage = require('./dynamic-page');
const home = require('./home');
const magazine = require('./magazine');
const websiteSections = require('./website-section');

const PING = gql`
  query {
    ping
  }
`;

module.exports = (server) => {
  home(server);

  server.get('/graphql-ping', asyncRoute(async (req, res) => {
    // this will emit a dep warning since `req.apollo` is being used.
    const { data } = await req.apollo.query({ query: PING });
    res.json(data);
  }), jsonErrorHandler());

  server.get('/error', () => {
    throw new Error('Bad!');
  });

  dynamicPage(server);

  magazine(server);

  content(server);

  websiteSections(server);
};
