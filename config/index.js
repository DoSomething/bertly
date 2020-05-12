import { get } from 'lodash';

import app from './app';

/**
 * Get the requested config, or use default.
 *
 * @param {String} key
 * @param {mixed} defaultValue
 */
export default (key, defaultValue = null) => {
  const config = { app };

  return get(config, key, defaultValue);
};
