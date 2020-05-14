/// <reference types="jest" />

import Link from '../Models/Link';
import { visit, expectJsonFile } from '../testing';
import { dropTable } from '../helpers';

jest.mock('uuid', () => {
  return { v4: () => 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx' };
});

beforeEach(() => dropTable(Link));

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
    const response = await visit(`/xyz123`);

    expect(response.status).toBe(302);
    expect(response.headers.location).toBe('http://www.dosomething.org/404');
  });
});
