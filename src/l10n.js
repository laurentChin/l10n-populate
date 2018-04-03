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

function populate (source, translations) {
  let sourceCopy = source;

  translations.forEach((value, key) => {
    sourceCopy = sourceCopy.replace(`{{${key}}}`, value);
  });

  return sourceCopy;
}

module.exports = {
  composeKey,
  buildMap,
  populate
};
