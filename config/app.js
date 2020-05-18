import { assert } from '@sindresorhus/is';

import { env, oneOf } from '.';

const NODE_ENV = env('NODE_ENV', oneOf('development', 'test', 'production'));

export default {
  /**
   * The application name (used to identify this particular
   * instance, e.g. 'dosomething-bertly-dev').
   *
   * @type {String}
   */
  name: env('APP_NAME', assert.nonEmptyString),

  /**
   * Are we running in a production environment? This hide
   * stack traces from the user, force HTTPS and secure cookies,
   * and configure the app to run behind a proxy.
   *
   * @type {Boolean}
   */
  debug: NODE_ENV !== 'production',

  /**
   * The base application URL, used to redirect to canonical
   * URL & create OAuth redirect URI.
   *
   * @type {String}
   */
  url: env('APP_URL', assert.urlString),

  /**
   * The port that traffic should be served from.
   *
   * @type {String}
   */
  port: env('PORT', assert.integer),

  /**
   * A secret used to "salt" our shortlinks.
   *
   * @type {String}
   */
  secret: env('APP_SECRET', assert.nonEmptyString),
};
