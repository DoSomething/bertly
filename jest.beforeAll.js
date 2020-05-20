import AWS from 'aws-sdk';

// Configure the AWS SDK to use our local in-memory
// DynamoDB server for tests (see 'jest.setup.js'):
AWS.config.update({
  region: 'us-east-1',
  // By default, DynamoDB Local uses port 8000. We swap to 45671 when running these
  // tests locally so as not to conflict with Homestead or 'npm run dev'.
  endpoint: process.env.CI ? 'http://localhost:8000' : 'http://localhost:45671',
});

// Configure base mocks:
jest.mock('./src/Auth/issuer');

// Configure test environment variables:
process.env.APP_NAME = 'dosomething-bertly-test';
process.env.APP_URL = 'https://localhost:3000';
process.env.APP_SECRET = 'testing';
process.env.LOG_LEVEL = 'error';
process.env.PORT = 3000;
process.env.STORAGE_DRIVER = 'local';
process.env.BERTLY_API_KEY_NAME = 'X-BERTLY-API-KEY';
process.env.BERTLY_API_KEY = 'secret1';
process.env.OPENID_DISCOVERY_URL = 'https://localhost:5000'; // required, but unused. we mock these calls in tests.
