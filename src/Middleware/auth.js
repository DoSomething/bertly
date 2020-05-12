import * as Express from 'express';

/**
 * Authenticate this request.
 *
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @param {Function} next
 */
export default async function authenticate(req, res, next) {
  // TODO: Check for API key here. :)

  next();
}
