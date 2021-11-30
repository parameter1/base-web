const websiteScheduledContent = require('./website-scheduled-content');

const { isArray } = Array;

/**
 * Performs a `websiteScheduledContent` with an `optionId`.
 * If the optioned content is less than the requested limit, another query
 * will be perfomed without the option to fill the remaining limit requirement.
 *
 * This is primarily used for creating "Pinned Content" blocks.
 *
 * @param {object} baseCMSGraphQLClient The BaseCMS GraphQL client that will perform the query.
 * @param {object} params The params object that will be sent to `websiteScheduledContent`.
 */
const executeQuery = async (baseCMSGraphQLClient, params = {}) => {
  const {
    optionId,
    optionName,
    limit = 20, // Must set a default limit.
    optionDepleted,
  } = params;
  // If no option id/name was provided (or the option query is depleted), perform a "regular" query.
  if ((!optionId && !optionName) || optionDepleted) {
    return websiteScheduledContent.executeQuery(baseCMSGraphQLClient, params);
  }

  // Retrieve content with option (do not allow section bubbling).
  const optioned = await websiteScheduledContent.executeQuery(baseCMSGraphQLClient, {
    ...params,
    sectionBubbling: false,
  });
  const { length } = optioned.nodes;

  // If enough optioned content was found to fulfill then return it.
  if (length >= limit) return { ...optioned, optionDepleted: false };

  // Retrieve scheduled content, excluding the option and any found content.
  const ids = optioned.nodes.map((node) => node.id);
  const excludeContentIds = isArray(params.excludeContentIds)
    ? [...ids, ...params.excludeContentIds] : ids;
  const scheduled = await websiteScheduledContent.executeQuery(baseCMSGraphQLClient, {
    ...params,
    optionId: undefined,
    optionName: undefined,
    excludeContentIds,
  });

  // If no optioned content was found then return the scheduled content.
  if (!length) return { ...scheduled, optionDepleted: true };

  // Merge the content up to the limit and return the scheduled page info.
  const diff = limit - length;
  const nodes = [...optioned.nodes, ...scheduled.nodes.slice(0, diff)];
  return {
    nodes,
    pageInfo: scheduled.pageInfo,
    section: scheduled.section,
    optionDepleted: true,
  };
};

module.exports = {
  defaultFragment: websiteScheduledContent.defaultFragment,
  buildGraphQLOperation: websiteScheduledContent.buildGraphQLOperation,
  executeQuery,
};
