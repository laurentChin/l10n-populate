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

function createMissingDir (fs, missingPath) {
  /**
   * removes process.env.PWD from the path,
   * we know that this part of the path exists
   */
  const relativePath = missingPath.replace(process.env.PWD, '');

  const parts = relativePath.split('/');

  let parentPath = (missingPath.indexOf(process.env.PWD) === 0) ? process.env.PWD : (parts[0] || '/');

  try {
    parts.forEach((part) => {

      if (part !== '') {
        const fullPath = `${parentPath}/${part}`.replace('//', '/');
        console.log(fullPath);
        parentPath = fullPath;
        try {
          // create the directory only it it doesn't already exists
          fs.statSync(fullPath);
        } catch (e) {
          fs.mkdirSync(fullPath);
        }
      }
    });
    return true;
  } catch (e) {
    return false;
  }
}

module.exports = {
  createFile: createFile.bind(null, fs),
  createMissingDir: createMissingDir.bind(null, fs),
  buildPath
};
