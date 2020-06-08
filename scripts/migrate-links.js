import AWS from 'aws-sdk';
import redis from 'redis';
import { promisify } from 'util';
import { info } from 'heroku-logger';

import Link from '../src/Models/Link';

// Configure storage connections for AWS, Redis, and RDS:
AWS.config.update({ region: 'us-east-1' });

const redisClient = redis.createClient({ url: process.env.REDIS_URL });
const redisGet = promisify(redisClient.get).bind(redisClient);
const redisScan = promisify(redisClient.scan).bind(redisClient);

// Helper to cleanly run a Redis SCAN & track counter as we go.
// Adapted from: https://dev.to/eastpole/redis-async-generators-3ed
const keysMatching = async function* (pattern, initialCursor = '0') {
  let cursor = initialCursor;

  do {
    info('Scanning for links', { cursor });

    const [newCursor, keys] = await redisScan(cursor, 'MATCH', pattern);

    for (const key of keys) {
      yield key;
    }

    cursor = newCursor;
  } while (cursor !== '0');
};

(async () => {
  // Iterate over our existing links and migrate them to Bertly 2.0's storage:
  for await (const redisKey of keysMatching('bertly:key:*')) {
    const key = redisKey.replace('bertly:key:', '');
    const url = await redisGet(redisKey);

    // Write link record to DynamoDB:
    info('Migrating shortlink.', { key, url });
    await Link.update({ key }, { url });
  }

  console.log('Done!');
})();
