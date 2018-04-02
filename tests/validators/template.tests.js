const test = require('tape');

const path = require('path');

const templateValidator = require('../../src/validators/template');

test('template must be an html file or a directory containing html file(s)', t => {
  t.plan(4);
  t.ok(
    templateValidator.isValid(path.join(__dirname, '../__fixtures__/index.html')),
    'must return false if the template is an html file'
  );

  t.notOk(
    templateValidator.isValid(path.join(__dirname, '../__fixtures__/test')),
    'must return false if the template directory does not exist'
  );

  t.notOk(
    templateValidator.isValid(path.join(__dirname, '../__fixtures__/empty_template_dir')),
    'must return false if the template is an empty directory'
  );

  t.notOk(
    templateValidator.isValid(path.join(__dirname, '../__fixtures__/input_test')),
    'must return false if the template directory do not contains any html files'
  );
});
