import * as Express from 'express';
import { info } from 'heroku-logger';

import Link from '../Models/Link';
import { user, context } from '../helpers';
import { UnauthorizedError } from 'express-jwt';
import NotFoundException from '../Exceptions/NotFoundException';

/**
 * Destroy a shortlink.
 * DELETE /{link}
 *
 * @param {Express.Request} req
 * @param {Express.Response} res
 */
export default async function destroyLink(req, res) {
  const link = await Link.get(req.params.link);

  if (!link) {
    throw new NotFoundException('Not found.');
  }

  if (user(req) && !user(req).hasRole('staff', 'admin')) {
    throw new UnauthorizedError('credentials_required', {
      message: `Requires 'staff' or 'admin' role.`,
    });
  }

  await link.delete();

  info('Link deleted.', { key: link.key, ...context(req) });

  return res.status(200).json({ message: 'Link deleted.' });
}
