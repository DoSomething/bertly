import chalk from 'chalk';
import Joi, { Root } from '@hapi/joi';
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
