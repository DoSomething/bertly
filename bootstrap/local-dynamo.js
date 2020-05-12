const localDynamo = require('local-dynamo');

// We use Amazon's DynamoDB Local <https://dosome.click/nyewz2>
// for local development, using Medium's convenience wrapper so
// we don't need to mess with the JRE. <https://git.io/JfcxJ>
localDynamo.launch({
  // We persist the database in this local directory. You can
  // clear the current database by running 'npm run db:fresh'.
  dir: 'bootstrap/storage/database',

  // We pick a unique port since DynamoDB Local's default port
  // conflicts with Laravel Homestead.
  port: 45670,

  // Finally, we use one "shared" environment for local development
  // rather than creating separate databases per AWS credential:
  sharedDb: true,
});
