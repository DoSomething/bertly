import jwt from 'express-jwt';
import * as Express from 'express';

import config from '../../config';
import getPublicKey from '../Auth/issuer';

/**
 * Read the static API key header.
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
 * Authenticate request using a static API key.
 *
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @param {Function} next
 */
function authenticateByApiKey(req, res, next) {
  if (getApiKey(req) !== config('auth.key')) {
    return res.status(401).json({ message: 'Invalid API key.' });
  }

  next();
}

/**
 * Authenticate this request.
 *
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @param {Function} next
 */
export default async function authenticate(req, res, next) {
  // If a static API key is provided, use that:
  if (getApiKey(req)) {
    return authenticateByApiKey(req, res, next);
  }

  const issuer = config('auth.issuer');
  const secret = await getPublicKey(issuer);

  // Validate the provided OAuth token:
  jwt({ secret })(req, res, next);
}
