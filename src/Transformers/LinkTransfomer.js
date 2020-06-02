import { URL } from 'url';

import config from '../../config';

/**
 * This defines our response format for links.
 *
 * @param {Link} link
 * @return {Object}
 */
export const transform = link => ({
  key: link.key,
  url: link.url,
  url_short: new URL(link.key, config('app.url')),
  counter: link.counter, // @deprecated: We'll remove this in the future.
  count: link.counter,
  updatedAt: link.updatedAt.toISOString(),
  createdAt: link.createdAt.toISOString(),
});
