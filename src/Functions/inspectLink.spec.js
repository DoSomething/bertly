/// <reference types="jest" />

import Link from '../Models/Link';
import { getJson, dropTable } from '../testing';

beforeEach(() => dropTable(Link));

describe('inspectLink', () => {
  test('It should allow inspecting links', async () => {
    const link = await Link.create({
      key: 'xyz828f',
      url: 'http://www.example.com',
    });

    const response = await getJson(`/${link.key}/info`).send();

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('key', link.key);
    expect(response.body).toHaveProperty('url', link.url);
    expect(response.body).toHaveProperty('counter');
  });

  test('It should handle missing links', async () => {
    const response = await getJson(`/xyz123/info`);

    expect(response.status).toBe(404);
  });
});
