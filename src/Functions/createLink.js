import { pick } from 'lodash';
import HashId from 'hashids/cjs';
import { info } from 'heroku-logger';
import * as Express from 'express';

import config from '../../config';
import Link from '../Models/Link';
import { randomChar } from '../helpers';

/**
 * Crete a new shortlink key.
 *
 * @return {String}
 */
async function generateKey() {
  // In order to avoid a single "hot" key with our counter, we split
  // the table into 3,844 partitions (e.g. AA, AB, AC...). Each partition
  // keeps its own auto-incremented counter for making shortlinks, below:
  const partition = await Link.update(
    { key: `${randomChar()}${randomChar()}` },
    { $ADD: { counter: 1 } }
  );

  // We can then use hashids <https://hashids.org> to generate short
  // guaranteed unique IDs for each partition. (We pad these to be at
  // least 5 characters long so these new keys won't conflict with
  // Bertly 1.0's existing shortlinks).
  const id = new HashId(config('app.secret'), 5);

  // e.g. 'bSlejRe'
  return `${partition.key}${id.encode(partition.counter)}`;
}

/**
 * Create a new shortlink.
 * POST /
 *
 * @param {Express.Request} req
 * @param {Express.Response} res
 */
export default async function createLink(req, res) {
  // TODO: Validate input and return a 422 for bad stuff.
  const { url } = req.body;

  // Find & return already shortened link, if one exists.
  const result = await Link.query({ url }).limit(1).exec();
  const existing = result.count ? result[0] : null;
  if (existing) {
    info('Found matching shortlink', pick(existing, ['key', 'url']));

    return res.json(existing);
  }

  // If we haven't yet shortened this URL, make new shortlink:
  const key = await generateKey();
  const link = await Link.create({ key, url });

  info('Created new shortlink', pick(link, ['key', 'url']));

  return res.status(201).json(link);
}
