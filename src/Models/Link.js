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
    count: {
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

// See: https://dynamoosejs.com/guide/Model
const options = {
  ...config('database.defaults'),
};

export default model('links', schema, options);
