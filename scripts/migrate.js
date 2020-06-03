import AWS from 'aws-sdk';
import Redis from 'ioredis';
import { info } from 'heroku-logger';

import Link from '../src/Models/Link';
import { Client as PostgreSQL } from 'pg';
import { filesystem } from '../src/helpers';

// Configure storage connections for AWS, Redis, and RDS:
AWS.config.update({ region: 'us-east-1' });

const redis = new Redis(process.env.REDIS_URL);

const sql = new PostgreSQL({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: 'bertly_clicks',
  port: 5432,
});

(async () => {
  await sql.connect();

  // Iterate over our existing links and migrate them to Bertly 2.0's storage:
  const stream = redis.scanStream({ match: 'bertly:key:*', count: 100 });
  for await (const chunk of stream) {
    for (const link of chunk) {
      const key = link.replace('bertly:key:', '');
      const url = await redis.get(link);

      // Tally up clicks, and write to S3 bucket:
      const CLICKS_QUERY = 'SELECT * FROM clicks WHERE shortened = $1';
      const result = await sql.query(CLICKS_QUERY, [key]);
      for (const row of result.rows) {
        const clickId = `${key}-${row.click_id}`;

        const payload = {
          click_id: clickId,
          shortened: row.shortened,
          target_url: row.target_url,
          click_time: row.click_time.toISOString(),
          user_agent: row.user_agent,
        };

        filesystem().put(`${clickId}.json`, JSON.stringify(payload));
        info('Migrated click.', payload);
      }

      // Write link record to DynamoDB:
      const count = result.rows.length;
      await Link.update({ key }, { url, count });
      info('Migrated shortlink.', { key, url, count });
    }
  }

  await sql.end();

  console.log('Done!');
})();
