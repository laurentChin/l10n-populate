const fs = require('fs');

function lookup(fs, templateDirectoryPath, templateRootPath = '', previousMap = '') {
  let map;
  if (previousMap) {
    map = new Map(previousMap);
  } else {
    map = new Map();
  }

  if (templateRootPath === '') {
    templateRootPath = templateDirectoryPath;
  }

  const files = fs.readdirSync(templateDirectoryPath);
  files.forEach((file) => {
    const filePath = `${templateDirectoryPath}/${file}`;
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
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

module.exports = {
  lookup: lookup.bind(null, fs)
}