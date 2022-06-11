"use strict";

StartTest(t => {
  // NOTE: This test is required to be run against "module" bundle only!
  const {
    classes,
    classRename,
    guides
  } = window.bryntum,
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

  t.it('Check $name() and type() methods for Widget classes', t => {
    const singletonWidgets = ['MessageDialog', 'Ripple'];
    Object.entries(classes).forEach(([className, cls]) => {
      var _cls$prototype;

      // Skip checking singletons
      if (!singletonWidgets.includes(className) && (cls.prototype instanceof classes.Widget || // eslint-disable-next-line no-prototype-builtins
      (_cls$prototype = cls.prototype) !== null && _cls$prototype !== void 0 && _cls$prototype.isPrototypeOf(classes.Widget))) {
        // $name is mandatory for Widget class if there's no `get widgetClass` implementation
        if (!cls.widgetClass) {
          check$name(t, className, `$name is mandatory for Widget child class ${className}!`);
        } // type() is mandatory for Widget class


        if (!hasOwnProperty.call(cls, 'type')) {
          t.fail(`${className} has no static type() method or property!`);
        } else if (/[A-Z]/.test(cls.type)) {
          t.fail(`${className} static type() method or property value should be in lower case!`);
        }

        t.pass(`${className} widget checks passed`);
      }
    });
    t.pass(`Ok`);
  });
  t.it('Check guides links in code are valid', t => {
    let count = 0;
    const missingGuides = [];
    Object.entries(classes).forEach(([className, cls]) => {
      const circularReplacer = () => {
        return (key, value) => {
          return value === window || value === document ? '' : value;
        };
      },
            reGuide = /https?:\/\/bryntum.com\/docs\/.*\/guide\/(([a-zA-Z/0-9.]+))/gm,
            classText = cls.toString() + cls.constructor.toString() + JSON.stringify(cls.configurable, circularReplacer());

      let m;

      while (m = reGuide.exec(classText)) {
        count++;
        const guideName = m[1];

        if (!guides[guideName]) {
          missingGuides.push(`Wrong guide link "${guideName}". Class: ${className}`);
        }
      }
    });

    if (missingGuides.length > 0) {
      t.diag(`Found ${missingGuides.length} wrong guides links in code`);
      missingGuides.forEach(guide => t.fail(guide));
    } else {
      t.pass(`Guides links are ok. Checked ${count} guides`);
    }
  });
});