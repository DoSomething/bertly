import { Schema, model } from 'dynamoose';

import config from '../../config';

// See: https://dynamoosejs.com/guide/Schema
const schema = new Schema(
  {
    key: {
      hashKey: true,
      required: true,
      type: String,
    },
    url: {
      type: String,
      required: true,
      index: {
        name: 'urlIndex',
        global: true,
      },
    },
    counter: {
      type: Number,
      default: 0,
    },
  },
  // Automatically set 'createdAt' and 'updatedAt'
  // fields on these records upon creation/update.
  {
    timestamps: true,
  }
);

const options = {
  // If we're running in development, wait for the local server to be started and
  // automatically run a "migration" to create DynamoDB table if it doesn't exist.
  // (We skip this on production instances since it has a performance impact).
  create: ['development', 'test'].includes(process.env.NODE_ENV),
  waitForActive: ['development', 'test'].includes(process.env.NODE_ENV),

  // TODO: This seems to be bugged <https://git.io/Jf401>. We should see if we
  // can figure out what's going wrong here so we can run "update" migrations.
  update: false,

  // We use 'ON_DEMAND' capacity for this table since load is so variable.
  throughput: 'ON_DEMAND',

  // Prefix DynamoDB tables with the application name.
  prefix: `${config('app.name')}-`,
};

export default model('links', schema, options);
