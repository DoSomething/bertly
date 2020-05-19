/// <reference types="jest" />

import Link from '../Models/Link';
import { postJson, dropTable, withApiKey, withOAuthToken } from '../testing';

beforeEach(() => dropTable(Link));

describe('createLink', () => {
  test('It should create links', async () => {
    const url = 'https://www.example.com';
    const response = await postJson('/', { url }, withApiKey());

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('key');
    expect(response.body).toHaveProperty('url', url);
  });

  test('It should not create duplicate links', async () => {
    const link = await Link.create({
      key: 'xyz828f',
      url: 'http://www.example.com',
    });

    const response = await postJson('/', { url: link.url }, withApiKey());

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('key', link.key);
    expect(response.body).toHaveProperty('url', link.url);
  });

  test('It can shorten very long URLs', async () => {
    const url =
      'https://www.dosomething.org/us/articles/13-ways-the-sports-world-' +
      'is-stepping-up-during-the-coronavirus-pandemic?utm_source=content' +
      '_campaign&utm_medium=sms&utm_campaign=sms_weekly_2020_05_11&user_' +
      'id=55be62d4469c64182b91992b&broadcast_id=6v1RJUUmrWN2Ode0EW6lH';

    const response = await postJson('/', { url }, withApiKey());

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('key');
    expect(response.body).toHaveProperty('url', url);
  });

  test('It should require a URL', async () => {
    const request = { url: null };
    const response = await postJson('/', request, withApiKey());

    expect(response.status).toBe(422);
  });

  test('It should validate the provided URL', async () => {
    const request = { url: '19 W 21st Street' };
    const response = await postJson('/', request, withApiKey());

    expect(response.status).toBe(422);
  });

  test('It should restrict domains for non-staffers', async () => {
    const request = { url: 'https://www.google.com' };
    const response = await postJson('/', request, withOAuthToken('user'));

    expect(response.status).toBe(422);
  });

  test('It should allow all domains for staffers', async () => {
    const request = { url: 'https://www.google.com' };
    const response = await postJson('/', request, withOAuthToken('staff'));

    expect(response.status).toBe(201);
  });

  test('It should require authentication', async () => {
    const response = await postJson('/', { url: 'https://www.drupal.org' });

    expect(response.status).toBe(401);
  });
});
