/// <reference types="jest" />

import Link from '../Models/Link';
import { fresh } from '../helpers';
import { deleteJson, dropTable } from '../testing';

beforeEach(() => dropTable(Link));

describe('destroyLink', () => {
  test('It should destroy links', async () => {
    const link = await Link.create({
      key: 'xyz82f',
      url: 'http://www.example.com',
    });

    const response = await deleteJson(`/${link.key}`);

    expect(response.status).toBe(200);
    expect(await fresh(link)).toBeUndefined();
  });

  test('It should handle missing links', async () => {
    const response = await deleteJson(`/xyz123`);

    expect(response.status).toBe(404);
  });
});
