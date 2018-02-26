function isValid (content) {
  try {
    if (typeof JSON.parse(content) === 'object') {
      return true;
    }
  } catch (e) {}

  return false;
}

module.exports = {
  isValid
};
