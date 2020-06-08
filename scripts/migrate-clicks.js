import AWS from 'aws-sdk';
import { info, warn } from 'heroku-logger';
import { Condition } from 'dynamoose';

import Link from '../src/Models/Link';
import { Client as PostgreSQL } from 'pg';
import { filesystem } from '../src/helpers';

// Configure storage connections for AWS, Redis, and RDS:
AWS.config.update({ region: 'us-east-1' });

const sql = new PostgreSQL({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: 'bertly_clicks',
  port: 5432,
});

// Helper to cleanly paginate over all the rows in a SQL table:
const allRows = async function* (table, page = 1, perPage = 1000) {
  let offset = (page - 1) * perPage;

  await sql.connect();

  do {
    info('Loading rows from PostgreSQL.', { offset });

    const CLICKS_QUERY = `SELECT * FROM ${table} LIMIT $1 OFFSET $2`;
    const result = await sql.query(CLICKS_QUERY, [perPage, offset]);

    for (const row of result.rows) {
      yield row;
    }

    offset += limit;
  } while (result.rows.length !== 0);

  sql.end();
};

(async () => {
  for await (const row of allRows('clicks')) {
    const clickId = `${row.shortened}-${row.click_id}`;

    const payload = {
      click_id: clickId,
      shortened: row.shortened,
      target_url: row.target_url,
      click_time: row.click_time.toISOString(),
      user_agent: row.user_agent,
    };

    // If we've already migrated this click (based on it's unique ID), then
    // we can skip migrating it again (and yep, the 'exists' method returns
    // an object with an 'exists' property...):
    if (await filesystem().exists(`${clickId}.json`).exists) {
      info('Skipped click.', payload);

      continue;
    }

    try {
      // If this link exists, increment its click counter:
      await Link.update(
        { key: row.shortened },
        { $ADD: { count: 1 } },
        { condition: new Condition().filter('url').exists() }
      );

      filesystem().put(`${clickId}.json`, JSON.stringify(payload));

      info('Migrated click.', payload);
    } catch (e) {
      warn('Failed to migrate click.', payload);
    }
  }

  console.log('Done!');
})();
