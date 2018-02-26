const test = require('tape');
const path = require('path');

const fs = require('fs');

const contentValidator = require('../../src/validators/content');

test('content must be a json', t => {
  t.plan(2);
  t.equal(
    true,
    contentValidator.isValid(fs.readFileSync(path.join(__dirname, '../__fixtures__/fr.json'))),
    'must return true if the content is JSON'
  );
  t.equal(
    false,
    contentValidator.isValid(fs.readFileSync(path.join(__dirname, '../__fixtures__/en.json'))),
    'must return false if the content is not JSON'
  );
});
