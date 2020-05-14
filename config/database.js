const isRunningLocally = ['development', 'test'].includes(process.env.NODE_ENV);

export default {
  /**
   * The default settings for Dynamoose models.
   * @see https://dynamoosejs.com/guide/Model
   *
   * @type {Object}
   */
  defaults: {
    // If we're running in development, wait for the local server to be started and
    // automatically run a "migration" to create DynamoDB table if it doesn't exist.
    // (We skip this on production instances since it has a performance impact).
    create: isRunningLocally,
    waitForActive: isRunningLocally,

    // TODO: This seems to be bugged <https://git.io/Jf401>. We should see if we
    // can figure out what's going wrong here so we can run "update" migrations.
    update: false,

    // We use 'ON_DEMAND' capacity by default since load is so variable.
    throughput: 'ON_DEMAND',

    // Prefix our DynamoDB tables with the application name,
    // e.g. 'bertly-links' for the 'links' table.
    prefix: `${process.env.APP_NAME || 'bertly'}-`,
  },
};
