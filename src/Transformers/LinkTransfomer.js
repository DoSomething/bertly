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
  count: link.count,
  url: link.url,
  url_short: new URL(link.key, config('app.url')),
  updated_at: link.updatedAt.toISOString(),
  created_at: link.createdAt.toISOString(),
});
