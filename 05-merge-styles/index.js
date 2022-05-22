const fs = require('fs');
const path = require('path');

const stylesPath = path.join(__dirname, 'styles');
const bundleFile = fs.createWriteStream(path.join(__dirname, 'project-dist', 'bundle.css'));

fs.readdir(stylesPath, { withFileTypes: true }, (err, files) => {
  if (err) {
    console.error(err);
  }

  for (const file of files) {
    if (file.isFile() && path.extname(file.name) === '.css') {
      const filePath = path.join(stylesPath, file.name);
      const sourceFile = fs.createReadStream(filePath);

      sourceFile.pipe(bundleFile);
    }
  }
});