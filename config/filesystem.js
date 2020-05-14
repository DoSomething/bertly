import { resolve } from 'path';

export default {
  /**
   * The filesystem driver to use. Either 'local' or 's3'.
   *
   * @type {String}
   */
  default: process.env.STORAGE_DRIVER,

  /**
   * Configuration for FlyDrive drivers.
   * @see: https://github.com/Slynova-Org/flydrive
   *
   * @type {Object}
   */
  disks: {
    local: {
      driver: 'local',
      root: resolve(process.cwd(), 'bootstrap/storage/bucket'),
    },

    s3: {
      driver: 's3',
      region: 'us-east-1',
      key: process.env.AWS_ACCESS_KEY,
      secret: process.env.AWS_SECRET_KEY,
      bucket: process.env.AWS_S3_BUCKET,
    },
  },
};
