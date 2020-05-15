export default {
  /**
   * The header that Bertly's static API key will be
   * provided under.
   *
   * @type {String}
   */
  header: process.env.BERTLY_API_KEY_NAME || 'X-BERTLY-API-Key',

  /**
   * Bertly's static API key. This cannot be empty.
   *
   * @type {String}
   */
  key: process.env.BERTLY_API_KEY,
};
