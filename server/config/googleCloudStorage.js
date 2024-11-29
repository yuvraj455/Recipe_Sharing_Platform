const { Storage } = require('@google-cloud/storage');

const storage = new Storage({
  projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
  credentials: {
    client_email: process.env.GOOGLE_CLOUD_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_CLOUD_PRIVATE_KEY.replace(/\\n/g, '\n'),
  },
});

const bucket = storage.bucket(process.env.GOOGLE_CLOUD_BUCKET_NAME);

console.log('Google Cloud Storage initialized with:');
console.log('Project ID:', process.env.GOOGLE_CLOUD_PROJECT_ID);
console.log('Bucket Name:', process.env.GOOGLE_CLOUD_BUCKET_NAME);

module.exports = { bucket, storage };

