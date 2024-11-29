// Importing the Google Cloud Storage client library
const { Storage } = require('@google-cloud/storage');

// Initializing the Google Cloud Storage instance with project credentials from environment variables
const storage = new Storage({
  projectId: process.env.GOOGLE_CLOUD_PROJECT_ID, // Google Cloud Project ID
  credentials: {
    client_email: process.env.GOOGLE_CLOUD_CLIENT_EMAIL, // Client email for authentication
    private_key: process.env.GOOGLE_CLOUD_PRIVATE_KEY.replace(/\\n/g, '\n'), // Private key for authentication (handling newlines)
  },
});

// Accessing the specific Google Cloud Storage bucket from the environment variables
const bucket = storage.bucket(process.env.GOOGLE_CLOUD_BUCKET_NAME); // The name of the bucket to interact with

// Logging the Google Cloud Storage initialization details for debugging
console.log('Google Cloud Storage initialized with:');
console.log('Project ID:', process.env.GOOGLE_CLOUD_PROJECT_ID); // Logging the project ID
console.log('Bucket Name:', process.env.GOOGLE_CLOUD_BUCKET_NAME); // Logging the bucket name

// Exporting the storage and bucket objects for use in other parts of the application
module.exports = { bucket, storage };
