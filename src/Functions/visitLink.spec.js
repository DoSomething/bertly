/// <reference types="jest" />

import Link from '../Models/Link';
import { visit } from '../testing';
import { dropTable } from '../helpers';

beforeEach(() => dropTable(Link));

describe('visitLink', () => {
  test('It should redirect', async () => {
    await Link.create({ key: 'xyz828f', url: 'http://vote.dosomething.org' });

    const response = await visit(`/xyz828f`);

    expect(response.status).toBe(302);
    expect(response.headers.location).toBe('http://vote.dosomething.org');
  });

  test('It should handle missing links', async () => {
    const response = await visit(`/xyz123`);

    expect(response.status).toBe(302);
    expect(response.headers.location).toBe('http://www.dosomething.org/404');
  });
});
