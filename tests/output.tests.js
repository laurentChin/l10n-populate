const test = require('tape');
const fs = require('fs');

const output = require('../src/output');

test('output must own a createFile method', t => {
  t.plan(1);

  t.ok(output.hasOwnProperty('createFile'));
});

test(
  'output.createFile() must create a file at the given path with the given content',
  t => {
    t.plan(3);

    const target = `/tmp/test.html`;
    const content = '<html><head><title>title</title></head><body><p>body</p></body></html>';

    output.createFile(target, content);

    try {
      t.notEqual(
        fs.statSync(target),
        undefined
      );

      t.notEqual(fs.readFileSync(target, 'utf8'), '', 'created file must not be empty');
      t.equal(fs.readFileSync(target, 'utf8'), content, 'created file must contain the given content');
    } catch (e) {
      t.fail('must create a file at the given path');
    }

  }
);

test('output must own a buildPath method', t => {
  t.plan(1);

  t.ok(output.hasOwnProperty('buildPath'));
});

test(
  'output.buildPath() must return a path created with the filename, targetPath and basePath arguments',
  t => {
    t.plan(1);

    t.equal(
      output.buildPath('filename.html', 'target', '/base'),
      '/base/target/filename.html',
      'must return \'/base/target/filename.html\''
    );
  }
);

test(
  'output.buildPath() must add the subDirectory in the return value if given as argument',
  t => {
    t.plan(1);

    t.equal(
      output.buildPath('filename.html', 'target', '/base', 'fr'),
      '/base/target/fr/filename.html',
      'must return \'/base/target/fr/filename.html\''
    );
  }
);
