function buildMap (argMap, translations, keyPrefix = '') {
  let map = new Map(argMap);

  for (const translationKey in translations) {
    if (typeof translations[translationKey] === 'string') {
      map.set(composeKey(translationKey, keyPrefix), translations[translationKey]);
    } else {
      map = buildMap(map, translations[translationKey], composeKey(translationKey, keyPrefix));
    }
  }

  return map;
}

function composeKey (currentKey, keyPrefix = '') {
  if (keyPrefix !== '') {
    return `${keyPrefix}.${currentKey}`;
  } else {
    return currentKey;
  }
}

module.exports = {
  composeKey,
  buildMap
};
