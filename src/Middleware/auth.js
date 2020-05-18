import * as Express from 'express';

import config from '../../config';

/**
 *
 * @param {Express.Request} req
 * @returns {String}
 */
function getApiKey(req) {
  // Express normalizes all request headers to lower-case:
  const header = config('auth.header').toLowerCase();

  return req.headers[header];
}

/**
 * Authenticate this request.
 *
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @param {Function} next
 */
export default async function authenticate(req, res, next) {
  if (getApiKey(req) !== config('auth.key')) {
    return res.status(401).json({ message: 'Invalid API key.' });
  }

  next();
}
