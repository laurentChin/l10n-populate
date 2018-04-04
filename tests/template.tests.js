const test = require('tape');
const fs = require('fs');

const template = require('../src/template');

test('template must own a lookup method', t => {
  t.plan(1);
  t.ok(template.hasOwnProperty('lookup'));
});

test('template.lookup method must return a Map containing all the files in the target given', t => {
  t.plan(10);

  const templateSrc = `${process.env.PWD}/tests/__fixtures__/templates`;
  const templateLookupResponse = template.lookup(templateSrc);

  t.ok(templateLookupResponse instanceof Map);
  t.equal(templateLookupResponse.size, 4, 'the map size must equal 4');

  t.ok(templateLookupResponse.has('page_1.html'), 'the map must contain a page_1.html key');
  t.equal(
    fs.readFileSync(
      `${templateSrc}/page_1.html`,
      'utf8'
    ),
    templateLookupResponse.get('page_1.html'),
    'page_1.html must contain the right content'
  );

  t.ok(templateLookupResponse.has('page_2.html'), 'the map must contain a page_2.html key');
  t.equal(
    fs.readFileSync(
      `${templateSrc}/page_2.html`,
      'utf8'
    ),
    templateLookupResponse.get('page_2.html'),
    'page_2.html must contain the right content'
  );

  t.ok(templateLookupResponse.has('sub_level1/page_3.html'), 'the map must contain a sub_level1/page_3.html key');
  t.equal(
    fs.readFileSync(
      `${templateSrc}/sub_level1/page_3.html`,
      'utf8'
    ),
    templateLookupResponse.get('sub_level1/page_3.html'),
    'page_3.html must contain the right content'
  );

  t.ok(templateLookupResponse.has('sub_level1/sub_level2/page_4.html'), 'the map must contain a sub_level1/sub_level2/page_4.html key');
  t.equal(
    fs.readFileSync(
      `${templateSrc}/sub_level1/sub_level2/page_4.html`,
      'utf8'
    ),
    templateLookupResponse.get('sub_level1/sub_level2/page_4.html'),
    'page_4.html must contain the right content'
  );

});
