import AWS from 'aws-sdk';

// Configure the AWS SDK to use our local in-memory
// DynamoDB server for tests (see 'jest.setup.js'):
AWS.config.update({
  region: 'us-east-1',
  endpoint: 'http://localhost:45671',
});

// Configure test environment variables:
process.env.APP_NAME = 'dosomething-bertly-test';
process.env.APP_URL = 'https://localhost:3000';
process.env.APP_SECRET = 'testing';
process.env.LOG_LEVEL = 'error';
process.env.PORT = 3000;
process.env.STORAGE_DRIVER = 'local';
process.env.BERTLY_API_KEY_NAME = 'X-BERTLY-API-KEY';
process.env.BERTLY_API_KEY = 'secret1';
