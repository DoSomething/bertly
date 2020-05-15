import { get } from 'lodash';
import { error, debug } from 'heroku-logger';
import { Assert } from '@sindresorhus/is';

import app from './app';
import auth from './auth';
import database from './database';
import filesystem from './filesystem';

/**
 * Load an environment variable.
 *
 * @param {String} name
 * @param {Assert} validator
 * @param {*} default
 */
export function env(name, validator = null, defaultValue = null) {
  let variable = process.env[name];

  // If not set, use the default:
  if (!variable) {
    variable = defaultValue;
  }

  // Optionally, we can pass a type validator (from '@sindresorhus/is') to
  // throw an error if an improperly formatted environment variable is set:
  if (validator) {
    try {
      validator(variable);
    } catch (err) {
      const message = `The '${name}' environment variable is invalid: ${err.message}`;
      error(message, { [name]: variable });

      // Make sure that this registers as a failure for Jest, and gives some
      // instructions on how to set environment variables for the test runner:
      if (typeof jest !== 'undefined') {
        throw `${message}\n💡 You can configure Jest's environment variables in 'jest.beforeAll.js'.`;
      }

      process.exit(1);
    }
  }

  return variable;
}

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
