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

function checkDirectoryStructure(directoryTree) {
  const baseSet = new Set(directoryTree.map(_ => _.name));
  const baseSetTypes = new Set(directoryTree.map(_ => _.type))
  if (
    baseSet.size === 2 &&
    baseSetTypes.size === 1 &&
    baseSet.has("java") &&
    baseSet.has("resources") &&
    baseSetTypes.has("directory")
  ) {
    directoryTree.forEach(dtree => {
      const { name, files } = dtree;
      if (
        files.length === 1 && files[0].name === "in" && files[0].type === "directory" &&
        files[0].files.length === 1 && files[0].files[0].name === "hingua" && files[0].files[0].type === "directory" &&
        files[0].files[0].files.length === 1 && files[0].files[0].files[0].name === "samplecodepackage" && files[0].files[0].files[0].type === "directory"
      ) {} 
      else {
        console.log(directoryTree);
        throw new Error(`The src/main/${name} can contain only classpath in.hingua.samplecode`);
      }
    })
  } else {
    console.log(directoryTree);
    throw new Error("The src/main can onltain only two directories named resources and java.");
  }
}

const currentDirectory = 'src/main';
const directoryTree = generateDirectoryTree(currentDirectory);
checkDirectoryStructure(directoryTree)





// console.log(JSON.stringify(directoryTree, null, 2));
