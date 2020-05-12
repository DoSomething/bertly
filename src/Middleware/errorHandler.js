import { warn, error } from 'heroku-logger';
import stackTrace from 'callsite-record';

import config from '../../config';
import NotFoundException from '../Exceptions/NotFoundException';

/**
 * Display a "not found" error.
 *
 * @param {NotFoundException} err
 * @param {Express.Request} req
 * @param {Express.Response} res
 */
function missing(err, req, res) {
  warn(err.message, { url: req.originalUrl });

  // For browsers, redirect to our "pretty" 404 page:
  if (req.accepts('html')) {
    return res.redirect('http://www.dosomething.org/404');
  }

  return res.status(404).json({ message: err.message });
}

/**
 * Handle application errors.
 *
 * @param {Error} err
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @param {Function} next
 */
export default function errorHandler(err, req, res, next) {
  // Handle any named exceptions:
  if (err instanceof NotFoundException) {
    return missing(err, req, res);
  }

  // Otherwise, we're handling a fatal error:
  error(err.message);

  // If we're in debug mode, show a pretty stack trace:
  if (config('app.debug')) {
    console.log(stackTrace({ forError: err }).renderSync());
  }

  return res.status(500).json({ error: 'Something went wrong!' });
}
