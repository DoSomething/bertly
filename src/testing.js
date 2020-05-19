import http from 'http';
import { resolve } from 'path';
import { Test } from 'supertest';
import { sign } from 'jsonwebtoken';
import { readFileSync, promises as fs } from 'fs';

import app from './app';

/**
 * Create a new Supertest instance.
 *
 * @param {String} method
 * @param {String} url
 */
function request(method, url) {
  const server = http.createServer(app);

  return new Test(server, method, url);
}

/**
 * Run a GET request, expecting HTML.
 *
 * @param {String} url
 * @param {Object} headers
 */
export function visit(url, headers = {}) {
  return request('get', url)
    .set({ Accept: 'text/html', ...headers })
    .send();
}

/**
 * Run a GET request, expecting JSON.
 *
 * @param {*} url
 * @param {*} headers
 */
export function getJson(url, headers = {}) {
  return request('get', url)
    .set({ Accept: 'application/json', ...headers })
    .send();
}

/**
 * Run a POST request, expecting JSON.
 *
 * @param {*} url
 * @param {*} headers
 */
export function postJson(url, body, headers = {}) {
  return request('post', url)
    .set({ Accept: 'application/json', ...headers })
    .send(body);
}

/**
 * Run a DELETE request, expecting JSON.
 *
 * @param {*} url
 * @param {*} headers
 */
export function deleteJson(url, body, headers = {}) {
  return request('delete', url)
    .set({ Accept: 'application/json', ...headers })
    .send(body);
}

/**
 * Read a JSON file from our storage bucket.
 *
 * @param {String} path
 */
export async function expectJsonFile(path, expected) {
  const file = await fs.readFile(resolve('bootstrap/storage/bucket', path));
  const json = JSON.parse(file.toString('utf-8'));

  expect(json).toEqual(expect.objectContaining(expected));
}

/**
 * Drop the given database table.
 *
 * @return {Promise}
 */
export async function dropTable(Model) {
  if (process.env.NODE_ENV !== 'test') {
    throw new Error('Cannot drop tables in production.');
  }

  const records = await Model.scan().exec();
  return Promise.all(records.map(record => record.delete()));
}

/**
 * Return headers to make a request with a static API key.
 *
 * @return {Object}
 */
export function withApiKey() {
  return { 'X-Bertly-API-Key': 'secret1' };
}

/**
 * Return headers to make a request with an OAuth token.
 *
 * @param {String} role
 * @param {String[]} scopes
 * @return {Object}
 */
export function withOAuthToken(role = 'user', scopes = []) {
  const privateKeyPath = resolve(__dirname, 'Auth/__mocks__/private.test.key');
  const key = readFileSync(privateKeyPath, { encoding: 'utf-8' });

  const options = {
    algorithm: 'RS256',
    issuer: process.env.OPENID_DISCOVERY_URL,
    subject: '5554eac1a59dbf117e8b4567',
    audience: 'jest',
    expiresIn: '1h',
  };

  const jwt = sign({ role, scopes }, key, options);

  return { Authorization: `Bearer ${jwt}` };
}
