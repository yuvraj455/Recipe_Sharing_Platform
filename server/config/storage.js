const { Storage } = require('@google-cloud/storage');
const path = require('path');

const storage = new Storage({
  keyFilename: path.join(__dirname, '../yuvrajjindal-f2baa39c4d02.json'),
  projectId: 'yuvrajjindal',
});

const bucket = storage.bucket('yuvrajjindal');

module.exports = { bucket };

