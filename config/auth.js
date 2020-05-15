import { env } from '.';
import { assert } from '@sindresorhus/is';

export default {
  /**
   * The header that Bertly's static API key will be
   * provided under.
   *
   * @type {String}
   */
  header: env('BERTLY_API_KEY_NAME', assert.nonEmptyString),

  /**
   * Bertly's static API key. This cannot be empty.
   *
   * @type {String}
   */
  key: env('BERTLY_API_KEY', assert.nonEmptyString),
};
