import * as Express from 'express';

import Link from '../Models/Link';
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

  await link.delete();

  return res.status(200).json({ message: 'Link deleted.' });
}
