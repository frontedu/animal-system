"use strict";

StartTest(t => {
  // NOTE: This test is required to be run against "module" bundle only!
  const {
    ignoreList
  } = t.getConfig(),
        {
    classRename,
    classes
  } = window.bryntum,
        localeUsageRegExp = /L{([\w\d. %(){}-]+)}/gm,
        localeParseRegExp = /((.*?)\.)?(.+)/,
        locale = window.bryntum.locales.En,
        localeEntries = Object.entries(locale).filter(([className]) => !['localeName', 'localeDesc'].includes(className)),
        // Specify optional translations which are not required
  optionalKeys = {
    AnyClass: ['height', 'width', 'labelWidth', 'editorWidth', 'foo'],
    DateHelper: ['formats', 'weekStartDay'],
    PresetManager: ['secondAndMinute', 'minuteAndHour', 'hourAndDay', 'dayAndWeek', 'weekAndDay'],
    Localizable: ['group' // Used in snippet
    ]
  },
        isIgnored = (className, localeKey) => (ignoreList === null || ignoreList === void 0 ? void 0 : ignoreList.includes(className)) || (ignoreList === null || ignoreList === void 0 ? void 0 : ignoreList.includes(`${className}.${localeKey}`)),
        isOptional = (className, localeKey) => {
    var _optionalKeys$classNa;

    return optionalKeys.AnyClass.includes(localeKey) || ((_optionalKeys$classNa = optionalKeys[className]) === null || _optionalKeys$classNa === void 0 ? void 0 : _optionalKeys$classNa.includes(localeKey)) || isIgnored(className, localeKey);
  },
        moduleLocale = {},
        moduleLocaleStrict = {},
        moduleLocaleLazy = {},
        buildModuleLocale = () => {
    const handledClasses = new Map(); // Start collecting from the classes listed in the bundle

    const classesToProcess = new Map(Object.entries(classes)); // Find and process L{ClassName.LocaleKey} values from module classes into locale hierarchy

    classesToProcess.forEach((cls, className) => {
      if (handledClasses.has(cls)) return;

      const circularReplacer = () => {
        return (key, value) => {
          return value === window || value === document ? '' : value;
        };
      },
            classText = cls.toString() + cls.constructor.toString() + JSON.stringify(cls.configurable, circularReplacer());

      let m;

      while (m = localeUsageRegExp.exec(classText)) {
        const classMatch = localeParseRegExp.exec(m[1]),
              localeKey = classMatch[3],
              localeClass = classMatch[2],
              setLocale = (bundle, cls, key) => {
          cls = (classRename === null || classRename === void 0 ? void 0 : classRename[cls]) || cls;
          bundle[cls] = bundle[cls] || {};
          bundle[cls][key] = key;
        }; // By original className


        setLocale(moduleLocale, className, localeKey); // By locale Class if exist

        localeClass && setLocale(moduleLocale, localeClass, localeKey); // For checking localization

        setLocale(moduleLocaleStrict, localeClass || className, localeKey); // Localization is used from class with no localeClass

        !localeClass && setLocale(moduleLocaleLazy, className, localeKey);
      } // collect parent classes info (they could be not publicly listed in the bundle)


      if (cls.$$meta) {
        let parentCls = cls.$meta; // bubble the class hierarchy

        while (parentCls = parentCls.super) {
          var _parentCls, _parentCls2;

          const name = ((_parentCls = parentCls) === null || _parentCls === void 0 ? void 0 : _parentCls.class.$$name) || ((_parentCls2 = parentCls) === null || _parentCls2 === void 0 ? void 0 : _parentCls2.class.name);

          if (!classesToProcess.has(name)) {
            classesToProcess.set(name, parentCls.class);
          }
        }
      }

      handledClasses.set(cls, true);
    });
  },
        // Checks if locale is used by the provided class by searching for moduleLocale entry.
  // The function also searches for parent classes entries.
  isLocaleUsedByClass = (className, localeKey) => {
    var _cls;

    let cls = classes[className]; // get class meta if provided (for mixins we just have a function at the moment)

    cls = ((_cls = cls) === null || _cls === void 0 ? void 0 : _cls.$meta) || cls;

    while (className) {
      var _moduleLocale$classNa, _cls2, _cls3, _cls4;

      // if found locale usage in the class
      if ((_moduleLocale$classNa = moduleLocale[className]) !== null && _moduleLocale$classNa !== void 0 && _moduleLocale$classNa[localeKey]) {
        return true;
      } // otherwise iterate to parent class


      cls = (_cls2 = cls) === null || _cls2 === void 0 ? void 0 : _cls2.super;
      className = ((_cls3 = cls) === null || _cls3 === void 0 ? void 0 : _cls3.class.$$name) || ((_cls4 = cls) === null || _cls4 === void 0 ? void 0 : _cls4.class.name);
    }

    return false;
  },
        checked$names = [],
        check$name = (t, className, reason = '') => {
    if (checked$names.includes(className)) {
      return;
    }

    checked$names.push(className);
    let bryntumClass = classes[className]; // bryntumClass may be a mixin which means the "class" must be yielded by calling it.
    // Must try/catch because calling a constructor throws.

    if (!hasOwnProperty.call(bryntumClass, '$name')) {
      try {
        bryntumClass = bryntumClass();
      } catch (e) {}
    }

    if (!hasOwnProperty.call(bryntumClass, '$name')) {
      t.fail(`${className} class has no $name() static method. ${reason}`);
    } else {
      const className = bryntumClass.$name,
            requiredClassName = (classRename === null || classRename === void 0 ? void 0 : classRename[className]) || className;

      if (className !== requiredClassName) {
        t.fail(`${className} class has wrong $name() static method result.` + `\nExpected ${requiredClassName} got ${className}.` + '\nCheck exports in "webpack.entry.js" file and @typings for this class"');
      }
    }
  };

  const nestedLocales = {}; // collect cases of nest locale usages when one locale text contains another one:
  // MyClass : {
  //     Foo  : "My name is L{name}"
  //     name : "Bob"
  // }

  for (const [clsName, clsLocale] of localeEntries) {
    const clsLocaleText = JSON.stringify(clsLocale);
    let m;

    while (m = localeUsageRegExp.exec(clsLocaleText)) {
      nestedLocales[m[1]] = [] || nestedLocales[m[1]];
      nestedLocales[m[1]].push(clsName);
    }
  } // Build locale from classes in module bundle


  buildModuleLocale(); //console.log(JSON.stringify(moduleLocale, null, 2));

  t.it('Check English locale contains valid keys', t => {
    let count = 0;
    localeEntries.forEach(([className, clsLocales]) => {
      Object.keys(clsLocales).forEach(localeKey => {
        count++;

        if (localeKey.includes('.') || localeKey.includes('?')) {
          t.fail(`'${localeKey}' in '${className}' has "." or "?" in locale key`);
        }
      });
    });
    t.pass(`Checked ${count} entries`);
  });
  t.it('Check localization is not used in throw new Error()', t => {
    let count = 0;
    Object.entries(classes).forEach(([className, cls]) => {
      const classText = typeof cls === 'function' && cls.toString() || '';
      count++;

      if (/throw new Error\((me|this)\.L\(/.test(classText)) {
        t.fail(`"throw new Error(...)" should not contain Localization me.L() or this.L() in class "${className}"`);
      }
    });
    t.pass(`Checked ${count} entries`);
  });
  t.it('Compare English locale with module bundle', t => {
    let count = 0;
    localeEntries.forEach(([className, clsValues]) => {
      Object.keys(clsValues).forEach(localeKey => {
        count++;

        if (!isOptional(className, localeKey)) {
          // check if the locales is used in the source code
          // or is nested somewhere in other locales
          if (!isLocaleUsedByClass(className, localeKey) && !nestedLocales[`${className}.${localeKey}`]) {
            t.fail(`En localization ${className}.'L{${localeKey}}' is not found in module bundle.`);
          }
        }
      });
    });
    t.pass(`Checked ${count} entries`);
  });
  t.it('Check localize works for each entry in moduleLocales', t => {
    let count = 0;
    Object.entries(moduleLocaleStrict).filter(([className]) => !['Object'].includes(className)).forEach(([className, clsValues]) => {
      Object.keys(clsValues).forEach(localeKey => {
        count++;

        if (!isOptional(className, localeKey)) {
          var _moduleLocaleLazy$cla;

          const bryntumClass = classes[className]; // Check lazy locale loading and $name static method

          if ((_moduleLocaleLazy$cla = moduleLocaleLazy[className]) !== null && _moduleLocaleLazy$cla !== void 0 && _moduleLocaleLazy$cla[localeKey] && bryntumClass) {
            check$name(t, className, `Checking "${localeKey}" key.`);
          }

          if (bryntumClass !== null && bryntumClass !== void 0 && bryntumClass.localize) {
            // Class is Localizable
            if (!bryntumClass.localize(localeKey)) {
              t.fail(`${className}.localize('${localeKey}') failed`);
            }
          } else {
            var _locale$className;

            // Just check key in locale
            if (!((_locale$className = locale[className]) !== null && _locale$className !== void 0 && _locale$className[localeKey])) {
              t.fail(`'L{${localeKey}}' localization is not found for ${className}`);
            }
          }
        }
      });
    });
    t.pass(`Checked ${count} entries`);
  });
});