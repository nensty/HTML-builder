const fs = require('fs');
const path = require('path');

const fsPromises = fs.promises;
const stylesPath = path.join(__dirname, 'styles');
const assetsPath = path.join(__dirname, 'assets');
const componentsPath = path.join(__dirname, 'components');
const htmlPath = path.join(__dirname, 'template.html');
const distDirPath = path.join(__dirname, 'project-dist');

const makeBundle = async () => {
  await fsPromises.mkdir(distDirPath, {recursive: true}).then(() => {
    const indexHtmlPath = path.join(distDirPath, 'index.html');
    const indexHtmlFile = fs.createWriteStream(indexHtmlPath);
    const sourceFile = fs.createReadStream(htmlPath);

    sourceFile.pipe(indexHtmlFile);
  });

  const data = await fsPromises.readFile(path.join(distDirPath, 'index.html')).then((data) => data.toString());

  const componentsData = await fsPromises.readdir(componentsPath, {withFileTypes: true}).then(async (files) => {
    const mappedComponents = new Map();

    for (const file of files) {
      const regexp = '(\\w*)\\.(\\w+)';
      const fileName = file.name.match(regexp)[1];
      const filePath = path.join(componentsPath, file.name);

      await fsPromises.readFile(filePath).then((componentData) => {
        mappedComponents.set(fileName, componentData.toString());
      });
    }

    return mappedComponents;
  });

  let newData = data;

  for (const key of componentsData.keys()) {
    if (newData.trim().includes(`{{${key}}}`)) {
      newData = newData.replace(`{{${key}}}`, `${componentsData.get(key)}`);
    }
  }

  await fsPromises.writeFile(path.join(distDirPath, 'index.html'), newData);

  await fsPromises.readdir(stylesPath, {withFileTypes: true}).then((files) => {
    const bundleFile = fs.createWriteStream(path.join(distDirPath, 'style.css'));

    for (const file of files) {
      if (file.isFile() && path.extname(file.name) === '.css') {
        const filePath = path.join(stylesPath, file.name);
        const sourceFile = fs.createReadStream(filePath);

        sourceFile.pipe(bundleFile);
      }
    }
  });

  await fsPromises.mkdir(path.join(distDirPath, 'assets'), {recursive: true}).then(() => {
    fs.readdir(assetsPath, async (_, directories) => {
      for (const directory of directories) {
        await fsPromises.mkdir(path.join(distDirPath, 'assets', directory), {recursive: true});

        fs.readdir(path.join(assetsPath, directory), async(_, files) => {
          for (const file of files) {
            const oldFilePath = path.join(assetsPath, directory, file);
            const newFilePath = path.join(distDirPath, 'assets', directory, file);

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
      }
    });
  });
};

makeBundle();