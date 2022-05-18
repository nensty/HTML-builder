const path = require('path');
const fs = require('fs');

const filePath = path.join(__dirname, 'text.txt');
const stream = new fs.ReadStream(filePath);

stream.on('readable', function () {
  const data = stream.read();
  if (data != null) {
    console.log('data', data.toString());
  }
});