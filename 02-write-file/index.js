const path = require('path');
const fs = require('fs');
const readline = require('readline');

const filePath = path.join(__dirname, 'text.txt');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
const throwError = (err) => {
  if (err) {
    throw err;
  }
};

console.log('Hi, happy to see you!');

rl.on('line', (input) => {
  if (input.toLowerCase().trim() === 'exit') {
    process.exit(2);
  }

  fs.access(filePath, (error) => {
    error ?
      fs.writeFile(filePath, `${input} \n`, throwError) :
      fs.appendFile(filePath, `${input} \n`, throwError);
  });
});

process.on('exit', () => {
  console.log('Have a nice day, my lovely!');
  rl.close();
});