"use strict";

StartTest(t => {
  let calendar;
  t.beforeEach(t => {
    var _calendar;

    return (_calendar = calendar) === null || _calendar === void 0 ? void 0 : _calendar.destroy();
  });
  t.it('Sanity', async t => {
    calendar = await t.getCalendar({
      date: new Date()
    }); // set up locale map to check

    const locales = ['Nl', 'Ru', 'SvSE', 'En'],
          localeMap = [{
      path: 'todayButton',
      locale: 'Calendar.Today'
    }, {
      path: 'viewDescription',
      locale: () => calendar.activeView.description
    }, {
      path: 'todayButton',
      locale: 'Calendar.Today'
    }];

    for (const mode in calendar.modes) {
      const name = StringHelper.capitalize(mode);
      localeMap.push({
        path: `${mode}ShowButton`,
        locale: `${name}View.${name}`
      });
    } // this syntax allows to add await to validate change visually


    for (let i = 0, l = locales.length; i < l; i++) {
      const locale = locales[i];
      LocaleManager.applyLocale(locale);
      t.subTest(`Checking ${locale} locale`, t => {
        localeMap.forEach(item => {
          let expected;

          if (typeof item.locale === 'function') {
            expected = item.locale();
          } else {
            expected = ObjectHelper.getPath(LocaleManager.locale, item.locale);
          }

          t.is(calendar.widgetMap[item.path].element.textContent, expected);
        });
        const cells = Array.from(calendar.activeView.allDayEvents.element.querySelectorAll('.b-cal-cell-header'));
        cells.forEach(el => {
          const date = DateHelper.parse(el.dataset.headerDate),
                expected = new RegExp(DateHelper.getDayShortName(date.getDay())),
                got = el.querySelector('.b-day-name-day').textContent;
          t.expect(got).toMatch(expected);
        });
      });
    }
  });
});