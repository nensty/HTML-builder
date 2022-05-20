const path = require('path');
const fs = require('fs');

const filePath = path.join(__dirname, 'secret-folder');

fs.readdir(filePath, { withFileTypes: true }, (_, files) => {
  for (const file of files) {
    if (file.isFile()) {
      const regexp = '(\\w*)\\.(\\w+)';
      const filePath = path.join(__dirname, 'secret-folder', file.name);
      const fileName = file.name.match(regexp)[1];
      const fileExt = path.extname(file.name).match(regexp)[2];

      fs.stat(filePath, (_, { size }) => {
        console.log(`${fileName} - ${fileExt} - ${size}`);
      });
    }
  }
});