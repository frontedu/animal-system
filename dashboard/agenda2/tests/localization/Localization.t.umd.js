"use strict";

StartTest(t => {
  let calendar;
  const defaultCalendarConfig = {
    date: '2021-05-13',
    project: {
      eventsData: [{
        id: 1,
        name: 'Event 1',
        duration: 1,
        durationUnit: 'hour',
        startDate: '2021-05-13 15:00'
      }],
      resourcesData: [{
        id: 'r1',
        name: 'Resource 1'
      }, {
        id: 'r2',
        name: 'Resource 2'
      }],
      assignmentsData: [{
        id: 1,
        resourceId: 'r1',
        eventId: 1
      }, {
        id: 2,
        resourceId: 'r2',
        eventId: 1
      }]
    }
  };
  t.beforeEach(() => {
    var _calendar, _calendar$destroy;

    return (_calendar = calendar) === null || _calendar === void 0 ? void 0 : (_calendar$destroy = _calendar.destroy) === null || _calendar$destroy === void 0 ? void 0 : _calendar$destroy.call(_calendar);
  });
  t.afterEach(t => t.applyLocale('En'));
  t.it('Should localize correctly', async t => {
    function assertWeekDay(desc) {
      t.subTest(desc, t => {
        const {
          weekStartDay,
          nonWorkingDays
        } = DateHelper;
        ['day', 'week', 'month', 'year', 'agenda', 'day.allDayEvents'].forEach(key => {
          const view = ObjectHelper.getPath(calendar.widgetMap, key);
          t.is(view.weekStartDay, weekStartDay, `Week start day is ok on ${key} view`);
          t.is(view.month.weekStartDay, weekStartDay, `Week start day is ok on ${key}'s month instance`);
          t.isDeeply(view.nonWorkingDays, nonWorkingDays, `Non working days are ok on ${key} view`);
          t.isDeeply(view.month.nonWorkingDays, nonWorkingDays, `Non working days are ok on ${key}'s month instance`);
        });
        t.is(calendar.activeView.startDate.getDay(), weekStartDay, 'Week start day is ok');
        calendar.shiftPrevious();
        t.is(calendar.activeView.startDate.getDay(), weekStartDay, 'Week start day is ok');
      });
    }

    const DateHelperLocale = t.applyLocale('Ru').DateHelper;
    LocaleManager.extendLocale('Ru', {
      DateHelper: Object.assign({}, DateHelperLocale, {
        nonWorkingDays: {
          2: true,
          3: true
        }
      })
    });
    t.applyLocale('Ru');
    calendar = await t.getCalendar();
    assertWeekDay('RU locale pre-construct');
    t.applyLocale('En');
    assertWeekDay('Switch to EN locale in runtime');
    t.applyLocale('Ru');
    assertWeekDay('Switch to RU locale in runtime');
  }); // https://github.com/bryntum/support/issues/2781

  t.it('Should remove leading 0 in hour for US English locale', async t => {
    calendar = await t.getCalendar(defaultCalendarConfig);
    await t.waitForProjectReady(calendar);
    t.chain({
      diag: 'checking week view'
    }, {
      waitForSelector: '.b-weekview .b-dayview-timeaxis-time:contains(3 PM)',
      desc: 'Week view has time format correct'
    }, {
      waitForSelector: '.b-weekview [data-event-id=1] .b-event-time:contains(3 PM)',
      desc: 'Event 1 on week view has time format correct'
    }, {
      click: '.b-weekview [data-event-id=1]'
    }, {
      waitForSelector: '.b-sch-event-tooltip .b-sch-clock-text:contains(3 PM)',
      desc: 'Tooltip on week view has time format correct'
    }, {
      diag: 'checking day view'
    }, {
      click: '[data-ref="dayShowButton"]'
    }, {
      waitForSelector: '.b-dayview .b-dayview-timeaxis-time:contains(3 PM)',
      desc: 'Day view has time format correct'
    }, {
      waitForSelector: '.b-dayview [data-event-id=1] .b-event-time:contains(3 PM)',
      desc: 'Event 1 on day view has time format correct'
    }, {
      click: '.b-dayview [data-event-id=1]'
    }, {
      waitForSelector: '.b-sch-event-tooltip .b-sch-clock-text:contains(3 PM)',
      desc: 'Tooltip on day view has time format correct'
    });
  });
  t.it('Should format time correctly for SvSE locale', async t => {
    calendar = await t.getCalendar(defaultCalendarConfig);
    await t.waitForProjectReady(calendar);
    t.chain(async () => {
      t.applyLocale('SvSE');
    }, {
      diag: 'checking week view'
    }, {
      click: '[data-ref="weekShowButton"]'
    }, {
      waitForSelector: '.b-weekview .b-dayview-timeaxis-time:contains(15:00)',
      desc: 'Week view has time format correct'
    }, {
      waitForSelector: '.b-weekview [data-event-id=1] .b-event-time:contains(15:00)',
      desc: 'Event 1 on week view has time format correct'
    }, {
      click: '.b-weekview [data-event-id=1]'
    }, {
      waitForSelector: '.b-sch-event-tooltip .b-sch-clock-text:contains(15:00)',
      desc: 'Tooltip on week view has time format correct'
    }, {
      diag: 'checking day view'
    }, {
      click: '[data-ref="dayShowButton"]'
    }, {
      waitForSelector: '.b-dayview .b-dayview-timeaxis-time:contains(15:00)',
      desc: 'Day view has time format correct'
    }, {
      waitForSelector: '.b-dayview [data-event-id=1] .b-event-time:contains(15:00)',
      desc: 'Event 1 on day view has time format correct'
    }, {
      click: '.b-dayview [data-event-id=1]'
    }, {
      waitForSelector: '.b-sch-event-tooltip .b-sch-clock-text:contains(15:00)',
      desc: 'Tooltip on day view has time format correct'
    });
  });
  t.it('Should format time correctly for Ru locale', async t => {
    calendar = await t.getCalendar(defaultCalendarConfig);
    await t.waitForProjectReady(calendar);
    t.chain(async () => {
      t.applyLocale('Ru');
    }, {
      diag: 'checking week view'
    }, {
      click: '[data-ref="weekShowButton"]'
    }, {
      waitForSelector: '.b-weekview .b-dayview-timeaxis-time:contains(15:00)',
      desc: 'Week view has time format correct'
    }, {
      waitForSelector: '.b-weekview [data-event-id=1] .b-event-time:contains(15:00)',
      desc: 'Event 1 on week view has time format correct'
    }, {
      click: '.b-weekview [data-event-id=1]'
    }, {
      waitForSelector: '.b-sch-event-tooltip .b-sch-clock-text:contains(15:00)',
      desc: 'Tooltip on week view has time format correct'
    }, {
      diag: 'checking day view'
    }, {
      click: '[data-ref="dayShowButton"]'
    }, {
      waitForSelector: '.b-dayview .b-dayview-timeaxis-time:contains(15:00)',
      desc: 'Day view has time format correct'
    }, {
      waitForSelector: '.b-dayview [data-event-id=1] .b-event-time:contains(15:00)',
      desc: 'Event 1 on day view has time format correct'
    }, {
      click: '.b-dayview [data-event-id=1]'
    }, {
      waitForSelector: '.b-sch-event-tooltip .b-sch-clock-text:contains(15:00)',
      desc: 'Tooltip on day view has time format correct'
    });
  });
  t.it('Should format time correctly for Nl locale', async t => {
    calendar = await t.getCalendar(defaultCalendarConfig);
    await t.waitForProjectReady(calendar);
    t.chain(async () => {
      t.applyLocale('Nl');
    }, {
      diag: 'checking week view'
    }, {
      click: '[data-ref="weekShowButton"]'
    }, {
      waitForSelector: '.b-weekview .b-dayview-timeaxis-time:contains(15:00)',
      desc: 'Week view has time format correct'
    }, {
      waitForSelector: '.b-weekview [data-event-id=1] .b-event-time:contains(15:00)',
      desc: 'Event 1 on week view has time format correct'
    }, {
      click: '.b-weekview [data-event-id=1]'
    }, {
      waitForSelector: '.b-sch-event-tooltip .b-sch-clock-text:contains(15:00)',
      desc: 'Tooltip on week view has time format correct'
    }, {
      diag: 'checking day view'
    }, {
      click: '[data-ref="dayShowButton"]'
    }, {
      waitForSelector: '.b-dayview .b-dayview-timeaxis-time:contains(15:00)',
      desc: 'Day view has time format correct'
    }, {
      waitForSelector: '.b-dayview [data-event-id=1] .b-event-time:contains(15:00)',
      desc: 'Event 1 on day view has time format correct'
    }, {
      click: '.b-dayview [data-event-id=1]'
    }, {
      waitForSelector: '.b-sch-event-tooltip .b-sch-clock-text:contains(15:00)',
      desc: 'Tooltip on day view has time format correct'
    });
  });
});