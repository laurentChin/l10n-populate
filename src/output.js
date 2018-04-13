const fs = require('fs');
const nodePath = require('path');

function createFile (fs, target, content, retry = true) {
  return new Promise((resolve, reject) => {
    fs.open(target, 'w', (err) => {
      if (err && retry) {
        let path = target.split('/');
        path.pop();
        path = path.join('/');

        /**
         * create the missing directory tree
         */
        if (createMissingDir(fs, path)) {
          /**
           * retry the file creation
           */
          createFile(fs, target, content, true);
        }
      } else if (err && !retry) {
        reject(err);
      }

      fs.writeFile(target, content, (err) => {
        if (err) reject(err);
        resolve(true);
      });
    });
  });
}

function buildPath (filename, targetPath, subDirectory = '') {
  if (subDirectory !== '') {
    return nodePath.join(targetPath, subDirectory, filename);
  } else {
    return nodePath.join(targetPath, filename);
  }
}

function createMissingDir (fs, missingPath) {
  /**
   * removes process.env.PWD from the path,
   * we know that this part of the path exists
   */
  const relativePath = missingPath.replace(process.env.PWD, '');

  const parts = relativePath.split(nodePath.sep);

  let parentPath = (missingPath.indexOf(process.env.PWD) === 0) ? process.env.PWD : (parts[0] || '/');

  try {
    parts.forEach((part) => {

      if (part !== '') {
        const fullPath = nodePath.normalize(nodePath.join(parentPath, part));
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
