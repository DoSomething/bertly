export default {
  /**
   * The application name (used to identify this particular
   * instance, e.g. 'dosomething-bertly-dev').
   *
   * @type {String}
   */
  name: process.env.APP_NAME || 'bertly',

  /**
   * Are we running in a production environment? This hide
   * stack traces from the user, force HTTPS and secure cookies,
   * and configure the app to run behind a proxy.
   *
   * @type {Boolean}
   */
  debug: process.env.NODE_ENV !== 'production',

  /**
   * The base application URL, used to redirect to canonical
   * URL & create OAuth redirect URI.
   *
   * @type {String}
   */
  url: process.env.APP_URL,

  /**
   * The port that traffic should be served from.
   *
   * @type {String}
   */
  port: process.env.PORT || 3000,

  /**
   * A secret used to "salt" our shortlinks.
   *
   * @type {String}
   */
  secret: process.env.APP_SECRET,
};
