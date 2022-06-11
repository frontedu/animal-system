"use strict";

StartTest('All locales should have corresponding to English locale translations', t => {
  var _window$bryntum, _window$bryntum$local;

  const testConfig = t.getConfig(),
        // Ignore translations completely (merged with test config from tests/index.js)
  ignoreList = Object.assign({
    Core: [/DateHelper.unitAbbreviations\.\d\.\d/, /DateHelper.unitNames\.\d/, /DateHelper.nonWorkingDays\.\d/, /DateHelper.weekends\.\d/, /.*\.width$/, /.*\.height$/, /.*\.labelWidth$/, /.*\.editorWidth$/]
  }, testConfig.ignoreList),
        // Ignore translations for which En text equals = locale text  (merged with test config from tests/index.js)
  universalList = Object.assign({
    Core: []
  }, testConfig.universalList); // Append De locale from window

  if ((_window$bryntum = window.bryntum) !== null && _window$bryntum !== void 0 && (_window$bryntum$local = _window$bryntum.locales) !== null && _window$bryntum$local !== void 0 && _window$bryntum$local.De) {
    LocaleManager.locales.De = {
      desc: 'Deutsch',
      locale: window.bryntum.locales.De
    };
  } // Locales are loaded in "tests/index.js" file in Localization test group in "alsoPreloads"


  const locales = LocaleManager.locales,
        originalLocale = locales.En;
  originalLocale.localeName = 'En'; // Current locale for test

  let locale, localeName, matches, missing, redundant;

  function isIgnored(list, str) {
    return (list[localeName] || []).concat(list.Common || []).concat(list.Core).some(item => {
      return item instanceof RegExp ? item.test(str) : item === str;
    });
  }

  function assertMissing(t, original, asserted, path = '') {
    Object.keys(original).forEach(key => {
      const currentPath = path ? `${path}.${key}` : key; // if path should not be ignored

      if (!isIgnored(ignoreList, currentPath)) {
        // localization is found
        if (key in asserted && typeof asserted[key] === typeof original[key]) {
          // If value type is an object go inside
          if (typeof original[key] === 'object') {
            assertMissing(t, original[key], asserted[key], currentPath);
          } // values are the same then probably it's a copy-paste from asserted locale
          else if (original[key] === asserted[key]) {
            if (!isIgnored(universalList, currentPath)) {
              matches.push(currentPath);
            }
          }
        } // localization not found
        else {
          missing.push(currentPath);
        }
      }
    });
  }

  function assertRedundant(t, master, asserted, path = '') {
    Object.keys(asserted).forEach(localeKey => {
      const currentPath = path ? `${path}.${localeKey}` : localeKey;

      if (!isIgnored(ignoreList, currentPath)) {
        // if not found in master
        if (!(localeKey in master) || typeof master[localeKey] !== typeof asserted[localeKey]) {
          redundant.push(currentPath);
        } else if (typeof asserted[localeKey] === 'object') {
          assertRedundant(t, master[localeKey], asserted[localeKey], currentPath);
        }
      }
    });
  } // skip En locale during iterations


  delete locales.En;
  Object.keys(locales).forEach(name => {
    t.it(`Check ${name} locale`, t => {
      locale = locales[name];
      localeName = name;
      t.ok(locale.desc, `Locale description is specified for ${name}`); // Checking Missing Translations

      matches = [];
      missing = [];
      assertMissing(t, originalLocale.locale, locale.locale);

      if (matches.length > 0) {
        t.fail(`The following ${matches.length} string(s) in ${localeName} match En locale (add to "universalList" to ignore for test in tests/index.js)`);
        matches.forEach(str => t.fail(`'${str}',`));
      }

      if (missing.length > 0) {
        t.fail(`The following ${missing.length} string(s) in ${localeName} locale are missing (add to "ignoreList" to ignore for test in tests/index.js).`);
        missing.forEach(str => t.fail(`'${str}',`));
      } //Checking Redundant Translations


      redundant = [];
      assertRedundant(t, originalLocale.locale, locale.locale);

      if (redundant.length > 0) {
        t.fail(`The following ${redundant.length} string(s) in ${localeName} are redundant (add to "ignoreList" to ignore for test in tests/index.js)`);
        redundant.forEach(str => t.fail(`'${str}',`));
      }
    });
  });
});