const fs = require('fs');

function isValid (path) {
  try {
    const Stat = fs.statSync(path);
    // the path returns undefined
    if (Stat === undefined) {
      return false;
    }

    // the path is not a directory nor a file
    if (!Stat.isDirectory() && !Stat.isFile()) {
      return false;
    }

    if (Stat.isFile() && !isJson(path)) {
      return false;
    }

    if (isJson(path) && !filenameIsRFC3066(extractFilename(path))) {
      return false;
    }

    return true;
  } catch (e) {
    return false;
  }
}

function isJson (filename) {
  return /.json$/.test(filename);
}

function filenameIsRFC3066 (filename) {
  return /^[a-z]{2}(-[A-Z]{2,4})?.json$/.test(filename);
}

function extractFilename (path) {
  return path.substr(-(path.lastIndexOf('/'), (path.length - path.lastIndexOf('/') - 1)));
}

module.exports = {
  isValid
};
