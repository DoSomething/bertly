import memoize from 'p-memoize';
import { info } from 'heroku-logger';
import { Issuer } from 'openid-client';

/**
 * Get the public key from the given issuer, via the service's
 * OpenID Connect Discovery endpoint. <https://git.io/JfzJo>
 *
 * @param {String} url
 * @returns {String}
 */
export default memoize(async url => {
  info('Loading public key from Northstar.', { url });

  const issuer = await Issuer.discover(url);
  const keystore = await issuer.keystore();

  return keystore.get({ kty: 'RSA' }).toPEM();
});
