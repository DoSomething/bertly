/// <reference types="jest" />

import Link from '../Models/Link';
import { visit, expectJsonFile, dropTable } from '../testing';

jest.mock('uuid', () => {
  return { v4: () => 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx' };
});

beforeEach(async () => await dropTable(Link));

describe('visitLink', () => {
  test('It should redirect', async () => {
    const link = await Link.create({
      key: 'xyz828f',
      url: 'http://vote.dosomething.org',
    });

    const response = await visit(`/${link.key}`);

    await expectJsonFile('xyz828f-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx.json', {
      shortened: link.key,
      target_url: link.url,
      user_agent: 'node-superagent/3.8.3',
    });

    expect(response.status).toBe(302);
    expect(response.headers.location).toBe(link.url);
  });

  test('It should handle missing links', async () => {
    const response = await visit(`/abc123`);

    expect(response.status).toBe(302);
    expect(response.headers.location).toBe('http://www.dosomething.org/404');
  });

  test('It can redirect to very long URLs', async () => {
    const url =
      'https://www.dosomething.org/us/articles/13-ways-the-sports-world-' +
      'is-stepping-up-during-the-coronavirus-pandemic?utm_source=content' +
      '_campaign&utm_medium=sms&utm_campaign=sms_weekly_2020_05_11&user_' +
      'id=55be62d4469c64182b91992b&broadcast_id=6v1RJUUmrWN2Ode0EW6lH';

    const link = await Link.create({ key: '8df6332', url });

    const response = await visit(`/${link.key}`);

    expect(response.status).toBe(302);
    expect(response.headers.location).toBe(url);
  });
});
