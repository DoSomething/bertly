'use strict';

// Enable X-Ray for DynamoDB if 'ENABLE_ENHANCED_XRAY' is true:
if (process.env.ENABLE_ENHANCED_XRAY) {
  const AWSXRay = require('aws-xray-sdk');

  // Instrument the AWS SDK & pass in to Dynamoose:
  const AWS = AWSXRay.captureAWS(require('aws-sdk'));
  const dynamoose = require('dynamoose');
  dynamoose.aws.ddb.set(new AWS.DynamoDB());

  // Capture any HTTP requests made from app code:
  AWSXRay.captureHTTPsGlobal(require('http'));

  // And just drop a note that we've registered all this:
  var document = AWSXRay.getSegment();
  document.addAnnotation('enhanced-xray', true);
}

// We use the 'aws-serverless-express' package to run a familiar Express.js
// application within an AWS Lambda: https://git.io/Jfwbl
const { createServer, proxy } = require('aws-serverless-express');

// We use the compiled JavaScript (from 'npm run compile') in production:
const app = require('../build/src/app').default;

// Finally, we create a server instance & use it to respond to API
// Gateway events. This "server" instance is shared between
// all requests that hit a single Lambda "instance".
const server = createServer(app);

// Our handler function is called by Lambda for each request:
exports.handler = (event, context) => proxy(server, event, context);
