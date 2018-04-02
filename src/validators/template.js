const fs = require('fs');

function isValid (path) {
  if (isHtml(path)) { // don't go further if the file is an html
    return true;
  }

  try {
    const Stat = fs.statSync(path);

    if (Stat.isDirectory() && isEmpty(fs.readdirSync(path))) {
      return false;
    }

    // return true is the directory contains at least one html file
    return fs.readdirSync(path).some(isHtml);
  } catch (e) {
    return false;
  }
}

function isHtml (path) {
  return /.htm[l]?$/.test(path);
}

function isEmpty (fileList) {
  return fileList.length === 0;
}

module.exports = {
  isValid
};
