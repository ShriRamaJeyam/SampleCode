const fs = require('fs');
const path = require('path');

const filesToDelete = new Set([".DS_Store"]);

function generateDirectoryTree(currentPath, parentNode = null) {
  const tree = (parentNode ? parentNode.files : []);
  const files = fs.readdirSync(currentPath);

  files.forEach((file) => {
    const filePath = path.join(currentPath, file);
    const stats = fs.statSync(filePath);
    if (filesToDelete.has(file)) {
      fs.unlinkSync(filePath)
    } else {
      let item;
      if (stats.isDirectory()) {
        item = { name: file, type: 'directory', path: filePath, files: [] };
        generateDirectoryTree(filePath, item);
      } else {
        item = { name: file, type: 'file', path: filePath };
      }
      tree.push(item);
    }
  });
  return tree;
}

const currentDirectory = 'src/main';
const directoryTree = generateDirectoryTree(currentDirectory);
console.log(JSON.stringify(directoryTree, null, 2));
