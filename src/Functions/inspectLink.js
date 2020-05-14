import * as Express from 'express';

import Link from '../Models/Link';
import NotFoundException from '../Exceptions/NotFoundException';

/**
 * Inspect a shortlink.
 * GET /{link}/info
 *
 * @param {Express.Request} req
 * @param {Express.Response} res
 */
export default async function inspectLink(req, res) {
  const link = await Link.get(req.params.link);

  if (!link) {
    throw new NotFoundException('Not found');
  }

  return res.json(link);
}
