import { pick } from 'lodash';
import HashId from 'hashids/cjs';
import { info } from 'heroku-logger';
import * as Express from 'express';

import config from '../../config';
import Link from '../Models/Link';
import { transform } from '../Transformers/LinkTransfomer';
import { randomChar, validate, user, context, normalizeUrl } from '../helpers';
import ValidationException from '../Exceptions/ValidationException';

const ALLOWED_DOMAINS = config('domains');

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
    { $ADD: { count: 1 } }
  );

  // We can then use hashids <https://hashids.org> to generate short
  // guaranteed unique IDs for each partition. (We pad these to be at
  // least 5 characters long so these new keys won't conflict with
  // Bertly 1.0's existing shortlinks).
  const id = new HashId(config('app.secret'), 5);

  // e.g. 'bSlejRe'
  return `${partition.key}${id.encode(partition.count)}`;
}

/**
 * Create a new shortlink.
 * POST /
 *
 * @param {Express.Request} req
 * @param {Express.Response} res
 */
export default async function createLink(req, res) {
  const body = validate(req, v => ({
    url: v.string().uri().required(),
  }));

  // Normalize the URL before we query or save it:
  const url = normalizeUrl(body.url);

  // If a non-staffer is performing this action, are they allowed to
  // shorten this particular URL? (Superusers can shorten anything.)
  if (user(req) && user(req).hasRole('user')) {
    const { host } = new URL(url);

    if (!ALLOWED_DOMAINS.includes(host)) {
      throw new ValidationException('Invalid domain. <https://git.io/JfzLI>');
    }
  }

  // Find & return already shortened link, if one exists.
  const result = await Link.query({ url }).limit(1).exec();
  const existingLink = result.count ? result[0] : null;
  if (existingLink) {
    info('Found existing shortlink', {
      ...pick(existingLink, 'key', 'url'),
      ...context(req),
    });

    return res.json(transform(existingLink));
  }

  // If we haven't yet shortened this URL, make new shortlink:
  const key = await generateKey();
  const link = await Link.create({ key, url });

  info('Created new shortlink', {
    ...pick(link, 'key', 'url'),
    ...context(req),
  });

  return res.status(201).json(transform(link));
}
