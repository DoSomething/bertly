'use strict';

// Enable X-Ray for DynamoDB if 'ENABLE_ENHANCED_XRAY' is true:
if (process.env.ENABLE_ENHANCED_XRAY) {
  var AWSXRay = require('aws-xray-sdk');
  var dynamoose = require('dynamoose');
  dynamoose.AWS = AWSXRay.captureAWS(require('aws-sdk'));

  // Capture any HTTP requests made from app code:
  AWSXRay.captureHTTPsGlobal(require('http'));
}

// We use the 'aws-serverless-express' package to run a familiar Express.js
// application within an AWS Lambda: https://git.io/Jfwbl
const { createServer, proxy } = require('aws-serverless-express');

// We use the compiled JavaScript (from 'npm run compile') in production:
const app = require('../build/src/app');

// Finally, we create a server instance & use it to respond to API
// Gateway events. This "server" instance is shared between
// all requests that hit a single Lambda "instance".
const server = createServer(app);

exports.handler = (event, context) => {
  proxy(server, event, context);
};
