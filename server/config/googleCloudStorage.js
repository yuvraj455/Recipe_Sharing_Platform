const { Storage } = require('@google-cloud/storage');
const path = require('path');

const storage = new Storage({
  keyFilename: path.join(__dirname, '../google-cloud-key.json'),
  projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
});

const bucket = storage.bucket(process.env.GOOGLE_CLOUD_BUCKET_NAME);

console.log('Google Cloud Storage initialized with:');
console.log('Project ID:', process.env.GOOGLE_CLOUD_PROJECT_ID);
console.log('Bucket Name:', process.env.GOOGLE_CLOUD_BUCKET_NAME);

module.exports = { bucket, storage };

