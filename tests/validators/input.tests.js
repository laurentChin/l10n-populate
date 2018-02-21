const test = require('tape');
const path = require('path');

const inputValidator = require('../../src/validators/input');

test('input must be a directory or a json file', t => {
  t.plan(6);
  t.equal(
    false,
    inputValidator.isValid(path.join(__dirname, '../__fixtures__/undefined')),
    'must return false if the input is undefined'
  );
  t.equal(
    false,
    inputValidator.isValid(path.join(__dirname, '../__fixtures__/fr.txt')),
    'must return false if the extension is not a json'
  );
  t.equal(
    true,
    inputValidator.isValid(path.join(__dirname, '../__fixtures__/input_test')),
    'must return true if the input is a directory'
  );
  t.equal(
    true,
    inputValidator.isValid(path.join(__dirname, '../__fixtures__/fr.json')),
    'must return true if the input is a json file'
  );

  t.equal(
    true,
    inputValidator.isValid(path.join(__dirname, '../__fixtures__/fr-FR.json')),
    'must return true if the input name validate RFC3066'
  );

  t.equal(
    false,
    inputValidator.isValid(path.join(__dirname, '../__fixtures__/fra.json')),
    'must return false if the input name do not validate RFC3066'
  );
});
