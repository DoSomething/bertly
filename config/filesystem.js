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
      bucket: process.env.S3_BUCKET,
    },
  },
};
