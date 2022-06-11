"use strict";

StartTest(t => {
  let calendar;
  t.beforeEach(() => {
    var _calendar, _calendar$destroy;

    return (_calendar = calendar) === null || _calendar === void 0 ? void 0 : (_calendar$destroy = _calendar.destroy) === null || _calendar$destroy === void 0 ? void 0 : _calendar$destroy.call(_calendar);
  }); // https://github.com/bryntum/support/issues/3551

  t.it('Should translate Agenda List Range menu items', async t => {
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
    await t.click('.b-button[data-ref="agendaShowButton"]');
    await t.click('.b-cal-widget-settings-button');
    await t.waitForSelector('.b-menuitem');
    await t.waitForSelector('.b-menu-text:contains(Day)');
    t.applyLocale('Nl');
    await t.waitForSelector('.b-menu-text:contains(Dag)');
  });
});