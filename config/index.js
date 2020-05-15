import { get } from 'lodash';

import app from './app';
import auth from './auth';
import database from './database';
import filesystem from './filesystem';

/**
 * Get the requested config, or use default.
 *
 * @param {String} key
 * @param {mixed} defaultValue
 */
export default (key, defaultValue = null) => {
  const config = { app, auth, database, filesystem };

  return get(config, key, defaultValue);
};
