import { get } from 'lodash';

import app from './app';
import database from './database';
import filesystem from './filesystem';

/**
 * Get the requested config, or use default.
 *
 * @param {String} key
 * @param {mixed} defaultValue
 */
export default (key, defaultValue = null) => {
  const config = { app, database, filesystem };

  return get(config, key, defaultValue);
};
