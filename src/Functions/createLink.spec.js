/// <reference types="jest" />

import Link from '../Models/Link';
import { postJson } from '../testing';
import { dropTable } from '../helpers';

beforeEach(() => dropTable(Link));

describe('createLink', () => {
  test('It should create links', async () => {
    const url = 'https://www.example.com';
    const response = await postJson('/', { url });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('key');
    expect(response.body).toHaveProperty('url', url);
  });

  test('It should not create duplicate links', async () => {
    const link = await Link.create({
      key: 'xyz828f',
      url: 'http://www.example.com',
    });

    const response = await postJson('/', { url: link.url });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('key', link.key);
    expect(response.body).toHaveProperty('url', link.url);
  });
});
