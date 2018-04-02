const test = require('tape');

const l10nPopulator = require('../src/l10nPopulator');

test('l10nPopulator must own a buildMap function', t => {
  t.plan(1);

  t.ok(l10nPopulator.hasOwnProperty('buildMap'));
});

test('buildMap() must return a copy of the original Map given as argument', t => {
  t.plan(6);

  const originalMap = new Map();
  originalMap.set('key1', 1);
  originalMap.set('key2', 2);

  const translations = {
    stringKey: 'value'
  };

  const mapCopy = l10nPopulator.buildMap(originalMap, translations);

  t.isEqual(originalMap.size, 2, 'originalMap.size must equal 2');
  t.isEqual(originalMap.get('key1'), 1, 'originalMap.get(\'key1\') must equal 1');
  t.isEqual(originalMap.get('key2'), 2, 'originalMap.get(\'key2\') must equal 2');
  t.isEqual(mapCopy.size, 3, 'mapCopy.size must equal 3');
  t.isEqual(mapCopy.get('key1'), 1, 'mapCopy.get(\'key1\') must equal 1');
  t.isEqual(mapCopy.get('key2'), 2, 'mapCopy.get(\'key2\') must equal 2');
});

test('buildMap() must return a Map containing string keys with a dot separator for compound keys', t => {
  t.plan(8);
  const map = new Map();

  const translations = {
    'rootObject': {
      'level1': 'valueLevel1',
      'childObject': {
        'level2': 'valueLevel2',
        'grandChildObject': {
          'level3': 'valueLevel3'
        }
      }
    }
  };

  const buildedMap = l10nPopulator.buildMap(map, translations);
  t.ok(
    buildedMap.has('rootObject.level1'),
    'buildedMap has a rootObject.level1 key'
  );

  t.isEqual(
    buildedMap.get('rootObject.level1'),
    'valueLevel1',
    'rootObject.level1 must be \'valueLevel1\''
  );

  t.ok(
    buildedMap.has('rootObject.childObject.level2'),
    'buildedMap has a rootObject.childObject.level2 key'
  );

  t.notOk(
    buildedMap.has('rootObject.childObject'),
    'buildedMap has not rootObject.childObject key'
  );

  t.isEqual(
    buildedMap.get('rootObject.childObject.level2'),
    'valueLevel2',
    'rootObject.childObject.level2 must be \'valueLevel2\''
  );

  t.ok(
    buildedMap.has('rootObject.childObject.grandChildObject.level3'),
    'buildedMap has a rootObject.childObject.grandChildObject.level3 key'
  );

  t.notOk(
    buildedMap.has('rootObject.childObject.grandChildObject'),
    'buildedMap has not rootObject.childObject.grandChildObject key'
  );

  t.isEqual(
    buildedMap.get('rootObject.childObject.grandChildObject.level3'),
    'valueLevel3',
    'rootObject.childObject.grandChildObject.level3 must be \'valueLevel3\''
  );
});

test('l10nPopulator must own a composeKey function', t => {
  t.plan(1);

  t.ok(l10nPopulator.hasOwnProperty('composeKey'));
});

test('l10nPopulator.composeKey() must return a simple string when it\'s second argument is not given', t => {
  t.plan(1);

  t.equal(
    l10nPopulator.composeKey('expectedKey'),
    'expectedKey'
  );
});

test('l10nPopulator.composeKey() must return a composed string when it\'s second argument is given', t => {
  t.plan(1);

  t.equal(
    l10nPopulator.composeKey('expectedKey', 'baseKey'),
    'baseKey.expectedKey'
  );
});

test('l10nPopulator must own a populate function', t => {
  t.plan(1);

  t.ok(l10nPopulator.hasOwnProperty('populate'));
});

test('l10nPopulator.populate must replace the tokens in the \'source\' argument with the corresponding one of the \'translations\' argument', t => {
  t.plan(1);

  const map = new Map();
  map.set('rootObject.level1', 'level1 translation');
  map.set('rootObject.childObject.level2', 'level2 translation');

  t.isEqual(
    l10nPopulator.populate('the translation of level1 is {{rootObject.level1}}, the translation of level2 is {{rootObject.childObject.level2}}', map),
    'the translation of level1 is level1 translation, the translation of level2 is level2 translation',
    'the token {{rootObject.level1}} must be replaced with \'level1 translation\', the token {{rootObject.childObject.level2}} must be replaced with \'level2 translation\''
  );
});
