const fs = require('fs');

function createFile (fs, target, content) {
  try {
    const fd = fs.openSync(target, 'w');

    if (!fd) throw new Error(`Creation of ${target} failed.`);
    fs.writeFileSync(target, content);
  } catch (e) {
    throw e;
  }
}

function buildPath (filename, targetPath, basePath, subDirectory = '') {
  if (subDirectory !== '') {
    return `${basePath}/${targetPath}/${subDirectory}/${filename}`;
  } else {
    return `${basePath}/${targetPath}/${filename}`;
  }
}

module.exports = {
  createFile: createFile.bind(null, fs),
  buildPath
};
