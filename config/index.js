import { get } from 'lodash';

import app from './app';
import database from './database';

/**
 * Get the requested config, or use default.
 *
 * @param {String} key
 * @param {mixed} defaultValue
 */
export default (key, defaultValue = null) => {
  const config = { app, database };

  return get(config, key, defaultValue);
};
