const fs = require('fs');
const path = require('path');

const fsPromises = fs.promises;
const duplicatedDirPath = path.join(__dirname, 'files-copy');
const originalDirPath = path.join(__dirname, 'files');

const handleError = (err) => {
  if (err) {
    console.log(err);
  }
};

const makeClone = async () => {
  await fsPromises.rmdir(duplicatedDirPath, {recursive: true}).then(handleError);

  await fsPromises.mkdir(duplicatedDirPath, {recursive: true}).then(() => {
    fs.readdir(originalDirPath, async (_, files) => {
      for (const file of files) {
        const oldFilePath = path.join(__dirname, 'files', file);
        const newFilePath = path.join(__dirname, 'files-copy', file);

        try {
          await fs.copyFile(oldFilePath, newFilePath, handleError);
        } catch {
          console.log('The file could not be copied');
        }
      }
    });
  });
};

makeClone().then(handleError);
