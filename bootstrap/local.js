import AWS from 'aws-sdk';
import chalk from 'chalk';
import * as dynamoose from 'dynamoose';

import config from '../config';
import app from '../src/app';
import { printRoute } from '../src/helpers';
import DynamoLogger from '../src/Logging/DynamoLogger';

// Configure to use DynamoDB Local in development:
AWS.config.update({ region: 'us-east-1', endpoint: 'http://localhost:45670' });
dynamoose.logger.providers.set(new DynamoLogger());

// We run a simple Express server to run our functions
// on local development.
app.listen(config('app.port'), () => {
  const b = chalk.white.bold;

  console.log(
    chalk.yellow(String.raw`
     WW
    /__\
   | oo |     ${chalk.cyan.bold('Bert is ready to shorten some links!')}
  (|_()_|)
    \__/       ${b('Create Link:')} ${printRoute('POST', '/')}
   /|\/|\     ${b('Destroy Link:')} ${printRoute('DELETE', '/{link}')}
  ||||||||    ${b('Inspect Link:')} ${printRoute('GET', '/{link}/info')}
  ||||||||      ${b('Visit Link:')} ${printRoute('GET', '/{link}')}
  ||||||||
    `)
  );
});
