const { Storage } = require('@google-cloud/storage');
const path = require('path');

let bucket;

const initializeStorage = () => {
  const storage = new Storage({
    keyFilename: path.join(__dirname, '../google-cloud-key.json'),
    projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
  });

  bucket = storage.bucket(process.env.GOOGLE_CLOUD_BUCKET_NAME);
};

const getBucket = () => {
  if (!bucket) {
    throw new Error('Storage has not been initialized. Call initializeStorage first.');
  }
  return bucket;
};

module.exports = { initializeStorage, getBucket };

