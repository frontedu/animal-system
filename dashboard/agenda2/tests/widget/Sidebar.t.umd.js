"use strict";

StartTest(t => {
  let calendar, eventStore, resourceStore;
  t.beforeEach(() => {
    var _calendar;

    return (_calendar = calendar) === null || _calendar === void 0 ? void 0 : _calendar.destroy();
  });
  t.it('Sidebar navigation', async t => {
    eventStore = new EventStore({
      data: t.getHackathonData().events.rows
    });
    resourceStore = new ResourceStore({
      data: t.getHackathonData().resources.rows
    });
    calendar = await t.getCalendar({
      date: new Date(2019, 9, 14),
      eventStore,
      resourceStore
    });
    await t.click('.b-sidebar .b-datepicker [data-date="2019-10-20"]');
    t.is(calendar.modes.week.startDate, new Date(2019, 9, 20), 'Navigated correctly');
    await t.click('button:contains(Month)');
    t.is(calendar.mode, 'month');
    t.wontFire(calendar.activeView, 'resize');
    await t.click('.b-sidebar .b-datepicker [data-date="2019-09-30"]');
    t.is(calendar.modes.month.startDate, new Date(2019, 8, 1), 'Navigated correctly using month strict date ownership');
    await t.click('button:contains(Year)');

    async () => t.is(calendar.mode, 'year');

    await t.click('.b-sidebar .b-datepicker [data-ref="nextMonth"]');
    await t.waitForSelector('.b-sidebar .b-datepicker [data-date="2019-10-15"]');
    await t.click('.b-sidebar .b-datepicker [data-ref="nextMonth"]');
    await t.waitForSelector('.b-sidebar .b-datepicker [data-date="2019-11-15"]');
    await t.click('.b-sidebar .b-datepicker [data-ref="nextMonth"]');
    await t.click('.b-sidebar .b-datepicker [data-date="2020-01-11"]');
    t.is(calendar.modes.year.startDate, new Date(2019, 11, 29), 'Navigated correctly using year strict date ownership');
    await t.click('button:contains(Month)');
    await t.waitForAnimations();
    t.is(calendar.mode, 'month');
    t.wontFire(calendar.activeView, 'resize'); // Go through a whole year to make sure that no month names make the sidebar expand causing
    // the activeView to resize

    for (let i = 0; i < 12; i++) {
      await t.click('.b-sidebar .b-datepicker [data-ref="nextMonth"]');
      await t.waitForAnimations();
    }
  });
  t.it('Sidebar initially collapsed', async t => {
    eventStore = new EventStore({
      // Add a recurring meeting
      data: t.getHackathonData().events.rows.concat([{
        duration: 1,
        durationUnit: 'hour',
        id: 'twice-weekly',
        name: 'Recurring Meeting',
        recurrenceRule: 'FREQ=WEEKLY;BYDAY=TU,TH',
        startDate: new Date(2019, 9, 15, 13)
      }])
    });
    resourceStore = new ResourceStore({
      data: t.getHackathonData().resources.rows
    });
    calendar = await t.getCalendar({
      date: new Date(2019, 9, 14),
      eventStore,
      resourceStore,
      mode: 'month',
      sidebar: {
        collapsed: true
      }
    });
    t.isApproxPx(calendar.sidebar.element.getBoundingClientRect().right, 0, 'It\'s off the left immediately');
  });
  t.it('Allow datePicker to be configured away through sidebar items', async t => {
    eventStore = new EventStore({
      // Add a recurring meeting
      data: t.getHackathonData().events.rows.concat([{
        duration: 1,
        durationUnit: 'hour',
        id: 'twice-weekly',
        name: 'Recurring Meeting',
        recurrenceRule: 'FREQ=WEEKLY;BYDAY=TU,TH',
        startDate: new Date(2019, 9, 15, 13)
      }])
    });
    resourceStore = new ResourceStore({
      data: t.getHackathonData().resources.rows
    });
    calendar = await t.getCalendar({
      date: new Date(2019, 9, 14),
      eventStore,
      resourceStore,
      sidebar: {
        items: {
          datePicker: false
        }
      }
    }); // If this test executes with no errors and has no DatePicker, that's a pass

    t.selectorCountIs('.b-sidebar [data-ref="datePicker"]', 0, 'Sidebar\'s preconfgured datePicker correctly not present');
    t.selectorCountIs('.b-sidebar .b-datepicker', 0, 'Sidebar\'s preconfgured datePicker correctly not present');
  });
  t.it('Allow datePicker to be configured away through Calendar config', async t => {
    eventStore = new EventStore({
      // Add a recurring meeting
      data: t.getHackathonData().events.rows.concat([{
        duration: 1,
        durationUnit: 'hour',
        id: 'twice-weekly',
        name: 'Recurring Meeting',
        recurrenceRule: 'FREQ=WEEKLY;BYDAY=TU,TH',
        startDate: new Date(2019, 9, 15, 13)
      }])
    });
    resourceStore = new ResourceStore({
      data: t.getHackathonData().resources.rows
    });
    calendar = await t.getCalendar({
      date: new Date(2019, 9, 14),
      eventStore,
      resourceStore,
      datePicker: null
    }); // If this test executes with no errors and has no DatePicker, that's a pass

    t.selectorCountIs('.b-sidebar [data-ref="datePicker"]', 0, 'Sidebar\'s preconfgured datePicker correctly not present');
    t.selectorCountIs('.b-sidebar .b-datepicker', 0, 'Sidebar\'s preconfgured datePicker correctly not present');
  });
  t.it('Sidebar collapse overlay', async t => {
    eventStore = new EventStore({
      // Add a recurring meeting
      data: t.getHackathonData().events.rows.concat([{
        duration: 1,
        durationUnit: 'hour',
        id: 'twice-weekly',
        name: 'Recurring Meeting',
        recurrenceRule: 'FREQ=WEEKLY;BYDAY=TU,TH',
        startDate: new Date(2019, 9, 15, 13)
      }])
    });
    resourceStore = new ResourceStore({
      data: t.getHackathonData().resources.rows
    });
    calendar = await t.getCalendar({
      date: new Date(2019, 9, 14),
      overlaySidebar: true,
      eventStore,
      resourceStore
    }); // Sidebar collapse tool has been configured away because the Sidebar has no header

    t.selectorNotExists('.b-collapsetool');
    await t.click(calendar.tbar.widgetMap.toggleSideBar.element); // The locker element must become visible

    await t.waitForSelector('.b-panel-overlay-revealed .b-panel-collapse-size-locker');
    await t.click(calendar.tbar.widgetMap.toggleSideBar.element); // The locker element must become invisible

    await t.waitForSelectorNotFound('.b-panel-overlay-revealed .b-panel-collapse-size-locker');
  }); // https://github.com/bryntum/support/issues/2850

  t.it('Should respect weekStartDay set on Calendar', async t => {
    calendar = await t.getCalendar({
      weekStartDay: 1
    });
    t.is(calendar.widgetMap.datePicker.weekStartDay, 1, 'datePicker configured ok');
    t.contentLike('.b-sidebar .b-calendar-day-header[data-column-index="0"]', 'M', 'Sidebar datepicker should respect weekStartDay');
  });
});