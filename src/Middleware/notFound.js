import * as Express from 'express';

import NotFoundException from '../Exceptions/NotFoundException';

/**
 * Handle requests that don't match a route.
 *
 * @param {Express.Request} req
 * @param {Express.Response} res
 */
export default function notFound(req, res, next) {
  if (!req.route) {
    throw new NotFoundException('Route not found.');
  }

  next();
}
