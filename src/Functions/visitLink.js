import * as Express from 'express';
import { v4 as uuid } from 'uuid';

import Link from '../Models/Link';
import { filesystem } from '../helpers';
import NotFoundException from '../Exceptions/NotFoundException';
import { info } from 'heroku-logger';

/**
 * Write this click to our storage bucket.
 *
 * @param {Link} link
 * @param {Express.Request} req
 */
function storeClickEvent(link, req) {
  const clickId = `${link.key}-${uuid()}`;

  const payload = {
    click_id: clickId,
    shortened: link.key,
    target_url: link.url,
    click_time: new Date().toISOString(),
    user_agent: req.headers['user-agent'] || 'N/A',
  };

  info('Logged click event.', payload);

  filesystem().put(`${clickId}.json`, JSON.stringify(payload));
}

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

  // Update the link's "visits" counter & log details for analytics:
  // TODO: We should be able to finish this asynchronously after sending
  // the response, but it causes Jest issues. <https://git.io/JfRa3>
  await Link.update({ key: link.key }, { $ADD: { count: 1 } });
  storeClickEvent(link, req);

  return res.redirect(link.url);
}
