import http from 'http';
import { Test } from 'supertest';

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
