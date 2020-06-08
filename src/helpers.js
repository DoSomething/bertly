import chalk from 'chalk';
import Joi, { Root } from '@hapi/joi';
import normalize from 'normalize-url';
import { StorageManager } from '@slynova/flydrive';

import config from '../config';
import ValidationException from './Exceptions/ValidationException';

/**
 * Get the FlyDrive filesystem disk.
 *
 * @return {FlyDrive}
 */
export function filesystem() {
  const storage = new StorageManager(config('filesystem'));

  return storage.disk();
}

/**
 * Format the given HTTP request for printing to the terminal.
 *
 * @param {String} method
 * @param {String} path
 * @returns String
 */
export function printRoute(method, path) {
  const colors = {
    GET: chalk.green.bold,
    HEAD: chalk.gray.bold,
    POST: chalk.keyword('orange').bold,
    PUT: chalk.cyan.bold,
    PATCH: chalk.keyword('purple').bold,
    DELETE: chalk.red.bold,
    OPTIONS: chalk.gray.bold,
  };

  // Format "placeholders" in routes nicely:
  const url = `${config('app.url')}${path}`;
  const urlAndTokens = url.split(/({\w+})/);
  const prettyUrl = urlAndTokens
    .map(part =>
      part.startsWith('{') ? chalk.white.dim(part) : chalk.white(part)
    )
    .join('');

  return `${colors[method](method)} ${prettyUrl}`;
}

/**
 * Return a random alphanumeric character.
 *
 * @return {String}
 */
export function randomChar() {
  const alphabet =
    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

  // This *isn't* cryptographically secure, but we don't need it to be.
  // Math.random will give us a uniform distribution of characters
  // once N is large enough. See: https://git.io/JfcNa
  const offset = Math.floor(Math.random() * alphabet.length);

  return alphabet[offset];
}

/**
 * Refresh the given document from the database.
 *
 * @param {Document} model
 * @return {Document}
 */
export async function fresh(document) {
  const Model = document.model;
  const hashKey = Model.schema.getHashKey();

  return Model.get(document[hashKey]);
}

/**
 * Returns a simplified object for the authorized user.
 *
 * @param {Express.Request} req
 */
export function user(req) {
  if (!req.user) {
    return null;
  }

  const { user } = req;

  return {
    id: user.sub,
    hasRole: (...roles) => roles.includes(user.role),
    hasScope: scope => user.scopes.includes(scope),
  };
}

/**
 * Seralize some request context for logging.
 *
 * @param {Express.Request} req
 */
export function context(req) {
  if (!req.user) {
    return {};
  }

  return { userId: req.user.sub, client: req.user.aud };
}

/**
 * Validate the given request & return valid data.
 *
 * @param {*} req
 * @param {(v: Root) => any} rules
 * @returns {Object}
 */
export function validate(req, rules) {
  // e.g. v => ({ url: v.string().uri() })
  const schema = Joi.object(rules(Joi));

  const { value, error } = schema.validate(req.body);

  if (error) {
    throw new ValidationException(error.message);
  }

  return value;
}

/**
 * Normalize the given URL.
 *
 * @param {String} url
 * @returns {String}
 */
export function normalizeUrl(url) {
  // Options for 'normalize-url' <https://git.io/JfDQP>
  const options = {
    // For consistency with our old normalization logic, we'll
    // keep 'www.' on our URLs raher than stripping it.
    stripWWW: false,
    // We want URLs to resolve to the same shortlink regardless
    // of how the query parameters (UTMs, etc) are ordered.
    sortQueryParameters: true,
    // We do not want to remove any UTM parameters!
    removeQueryParameters: [],
  };

  return normalize(url, options);
}
