/**
 * We limit non-staff users to shortening URLs from
 * these approved domains. Staff/admin users may shorten
 * any URL, regardless of domain.
 *
 * @var {Array}
 */
export default [
  'www.dosomething.org',
  'qa.dosomething.org',
  'dev.dosomething.org',
  'vote.dosomething.org',
];
