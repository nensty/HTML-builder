const fs = require('fs');
const path = require('path');

const fsPromises = fs.promises;
const duplicatedDirPath = path.join(__dirname, 'fs_test2');
const originalDirPath = path.join(__dirname, 'files');

fsPromises.mkdir(duplicatedDirPath, {recursive: true}).then(() => {
  console.log('Directory created successfully');
  fs.readdir(originalDirPath, async (_, files) => {
    for (const file of files) {
      const oldFilePath = path.join(__dirname, 'files', file);
      const newFilePath = path.join(__dirname, 'fs_test2', file);

      try {
        await fs.copyFile(oldFilePath, newFilePath, (err) => {
          if (err) {
            console.log(err);
          }
        });
      } catch {
        console.log('The file could not be copied');
      }
    }
  });
});
