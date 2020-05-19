import { resolve } from 'path';
import { promises as fs } from 'fs';

/**
 * Return a mock public key for testing.
 *
 * @param {String} url
 * @returns {String}
 */
export default async url => {
  const mockPublicKey = resolve(__dirname, 'public.test.key');

  return fs.readFile(mockPublicKey, { encoding: 'utf-8' });
};
