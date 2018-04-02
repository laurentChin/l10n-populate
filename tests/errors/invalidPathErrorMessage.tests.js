const test = require('tape');

const invalidPathErrorMessage = require('../../src/errors/invalidPathErrorMessage');

test('the message must depend on the path given', t => {
  t.plan(2);

  t.equal('The program will now exit because \'input\' doesn\'t seems to be or contains valid file(s)', invalidPathErrorMessage.generate('input'));
  t.equal('The program will now exit because \'another_input\' doesn\'t seems to be or contains valid file(s)', invalidPathErrorMessage.generate('another_input'));
});
