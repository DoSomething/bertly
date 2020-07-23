import AWS from 'aws-sdk';
import redis from 'redis';
import { promisify } from 'util';
import { fromFile } from 'gen-readlines';
import { info, error } from 'heroku-logger';

import Link from '../src/Models/Link';
import { normalizeUrl } from '../src/helpers';

// Configure storage connections for AWS, Redis, and RDS:
AWS.config.update({ region: 'us-east-1' });

const redisClient = redis.createClient({ url: process.env.REDIS_URL });
const redisGet = promisify(redisClient.get).bind(redisClient);

(async () => {
  for (const line of fromFile(__dirname + '/keys.txt')) {
    const key = line.toString();
    const url = await redisGet(`bertly:key:${key}`);

    if (!url) {
      error('Skipped missing shortlink.', { key });
      return;
    }

    try {
      const normalizedUrl = normalizeUrl(url);
      const createdAt = new Date();

      info('Migrating shortlink.', { key, url });
      Link.update({ key }, { url: normalizedUrl, createdAt });
    } catch (e) {
      error('Could not migrate shortlink.', { key, url });
    }
  }
})();
