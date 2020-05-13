import chalk from 'chalk';

import config from '../config';

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
 * Drop the given database table.
 *
 * @return {Promise}
 */
export async function dropTable(Model) {
  if (process.env.NODE_ENV !== 'test') {
    throw new Error('Cannot drop tables in production.');
  }

  const records = await Model.scan().exec();
  return Promise.all(records.map(record => record.delete()));
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
