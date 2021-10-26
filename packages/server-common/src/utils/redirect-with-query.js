import { URLSearchParams } from 'url';
import { asObject } from '@parameter1/base-web-utils';

/**
 * @param {object} params
 * @param {string} params.path The request path or URL to redirect to.
 * @param {object} params.query The request query string object.
 * @returns {string}
 */
export default ({ path, query } = {}) => {
  const params = new URLSearchParams(asObject(query));
  if (!`${params}`) return path;
  const cleaned = path.replace(/^\/+/, '');
  const isExternal = /^http/.test(cleaned);

  // Must put a "fake" host in front of the path to properly parse.
  const to = isExternal ? cleaned : `http://localhost/${cleaned}`;
  const toUrl = new URL(to);
  toUrl.searchParams.forEach((value, key) => params.set(key, value));
  const origin = isExternal ? toUrl.origin : '';
  return `${origin}${toUrl.pathname}?${params}`;
};
