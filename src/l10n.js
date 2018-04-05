const fs = require('fs');
const template = require('./template');
const output = require('./output');

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

// TODO: use a generator for a future progress indicator
function process(output, l10nSrc, templateSrc, targetPath) {
  const l10nFileMap = lookup(fs, l10nSrc);
  const templateFileMap = template.lookup(templateSrc);

  return new Promise((resolve, reject) => {
    l10nFileMap.forEach((l10nContent, l10nFilename) => {
      const l10nMap = buildMap(new Map(), l10nContent);
      templateFileMap.forEach((templateContent, templateFilename) => {
        const populatedContent = populate(templateContent, l10nMap);
        const populatedFilePath = output.buildPath(
          templateFilename,
          targetPath,
          (l10nFileMap.size > 1) ? l10nFilename.replace('.json', '') : ''
        );

        output.createFile(populatedFilePath, populatedContent)
          .then(() => {
            resolve(l10nFileMap.size * templateFileMap.size);
          }, reject);
      });
    });
  });
}

/**
 * Lookup in path for l10n content,
 * returns a map containing the path (relative to the process.env.PWD) as key
 * and a object containing the l10n content as value
 * @param path
 * @return Map fileMap
 */
function lookup(fs, path) {
  const fileMap = new Map();
  const files = fs.readdirSync(path);
  files.forEach((file) => {
    fileMap.set(file, JSON.parse(fs.readFileSync(`${path}/${file}`)));
  });

  return fileMap;
}

module.exports = {
  composeKey,
  buildMap,
  populate,
  process: process.bind(null, output),
  lookup: lookup.bind(null, fs)
};
