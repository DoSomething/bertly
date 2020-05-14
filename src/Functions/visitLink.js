import * as Express from 'express';

import Link from '../Models/Link';
import NotFoundException from '../Exceptions/NotFoundException';

/**
 * Visit a shortlink.
 * GET /{link}
 *
 * @param {Express.Request} req
 * @param {Express.Response} res
 */
export default async function visitLink(req, res) {
  const link = await Link.get(req.params.link);

  if (!link) {
    throw new NotFoundException('Not found.');
  }

  // Increment this link's counter:
  Link.update({ key: link.key }, { $ADD: { counter: 1 } });

  // TODO: Log this "click" to our storage bucket.

  return res.redirect(link.url);
}
