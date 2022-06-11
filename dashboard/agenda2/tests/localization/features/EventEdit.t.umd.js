"use strict";

StartTest(t => {
  let calendar;
  t.beforeEach(() => {
    var _calendar, _calendar$destroy;

    return (_calendar = calendar) === null || _calendar === void 0 ? void 0 : (_calendar$destroy = _calendar.destroy) === null || _calendar$destroy === void 0 ? void 0 : _calendar$destroy.call(_calendar);
  }); // https://github.com/bryntum/support/issues/2958

  t.it('Should fit week days on week buttons', async t => {
    const initialTheme = DomHelper.themeInfo.name,
          checkEllipsis = () => {
      calendar.features.eventEdit.recurrenceEditor.widgetMap.daysButtonField.items.forEach(btn => {
        const {
          label: el
        } = btn;
        t.notOk(el.scrollWidth > el.clientWidth, `${btn.text} is visible on week button`);
      });
    };

    calendar = await t.getCalendar({
      date: new Date(2021, 5, 14),
      eventStore: {
        data: [{
          id: 1,
          duration: 1,
          durationUnit: 'h',
          name: 'One',
          startDate: new Date(2021, 5, 15, 10),
          resourceId: 1,
          recurrenceRule: 'FREQ=WEEKLY;INTERVAL=2'
        }, {
          id: 2,
          duration: 1,
          durationUnit: 'h',
          name: 'Two',
          startDate: new Date(2021, 5, 15, 12),
          resourceId: 1
        }]
      },
      resourceStore: {
        data: [{
          id: 1,
          name: 'Resource 1'
        }]
      }
    });
    await t.doubleClick('[data-event-id=1]');
    await t.click('.b-recurrencelegendbutton');
    ['Classic', 'Classic-Light', 'Classic-Dark', 'Material', 'Stockholm'].forEach(theme => {
      t.diag(`Theme ${theme}`);
      DomHelper.setTheme(theme);
      t.applyLocale('Nl');
      checkEllipsis();
      t.applyLocale('Ru');
      checkEllipsis();
      t.applyLocale('SvSE');
      checkEllipsis();
      t.applyLocale('En');
      checkEllipsis();
    });
    DomHelper.setTheme(initialTheme);
  });
});