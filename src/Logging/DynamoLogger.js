import { get } from 'lodash';
import stringifyObject from 'stringify-object';
import { error, warn, info, debug } from 'heroku-logger';

const LOGGERS = {
  fatal: error,
  error,
  warn,
  info,
};

class DynamoLogger {
  constructor(settings = {}) {
    this.settings = settings;
    this.type = 'json';
  }

  /**
   * Parse & print Dynamoose log message.
   *
   * @param {*} message
   */
  log(message) {
    // Parse and nicely format log contents:
    const { level, category, payload } = message;
    const contents = payload ? stringifyObject(payload) : null;

    // Output to the appropriate logger based on the given level.
    const logger = get(LOGGERS, level, debug);
    logger(category, { contents });
  }
}

export default DynamoLogger;
