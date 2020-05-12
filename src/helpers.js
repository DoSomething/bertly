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

