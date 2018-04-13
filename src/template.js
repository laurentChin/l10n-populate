const fs = require('fs');
const path = require('path');

function lookup(fs, templateDirectoryPath, templateRootPath = '', previousMap = '') {
  let map = previousMap ? new Map(previousMap) : new Map();

  if (templateRootPath === '') {
    templateRootPath = templateDirectoryPath;
  }

  const files = fs
    .readdirSync(templateDirectoryPath)
    .filter((file) => {
      const fileStat = fs.statSync(path.join(templateDirectoryPath, file));
      return (fileStat.isFile() && isHTML(file)) || fileStat.isDirectory();
    });

  files.forEach((file) => {
    const filePath = `${templateDirectoryPath}/${file}`;
    if (fs.statSync(filePath).isDirectory()) {
      map = lookup(fs, filePath, templateRootPath, map);
    } else {
      map.set(pathCleanup(filePath, templateRootPath), fs.readFileSync(filePath, 'utf8'));
    }
  });

  return map;
}

function pathCleanup(path, templateRootDir) {
  return path
    .replace(`${templateRootDir}/`, '');
}

function isHTML(file) {
  return /.html$/.test(file);
}

module.exports = {
  lookup: lookup.bind(null, fs)
};
