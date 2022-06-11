"use strict";

/* eslint-disable quote-props */
StartTest(t => {
  // eslint-disable-next-line no-unused-vars
  let calendar, eventStore, resourceStore, agenda, year, month, week, day;
  t.beforeEach(function () {
    var _calendar;

    (_calendar = calendar) === null || _calendar === void 0 ? void 0 : _calendar.destroy();
  });
  t.it('Should scroll to the visibleStartTime hour at first render', async t => {
    calendar = await t.getCalendar({
      date: new Date(2019, 9, 14),
      project: new ProjectModel()
    });
    t.is(calendar.mode, 'week', 'Week view set initially');
    t.is(calendar.activeView.visibleStartTime, 7, 'Reasonable default set as visibleStartTime');
    const cell7AM = t.query('.b-weekview .b-dayview-timeaxis-time:contains(7)')[0];
    const cell7AMRect = t.rect(cell7AM);
    await t.waitFor(() => Math.abs(cell7AMRect.top + cell7AMRect.height / 2 - t.rect('.b-weekview .b-dayview-allday-row-start').bottom) < 5);
  });
  t.it('Should scroll to the visibleStartTime hour when data is delayed', async t => {
    t.mockUrl('delayed-allday-events', {
      delay: 1000,
      responseText: JSON.stringify({
        success: true,
        resources: {
          rows: [{
            id: 1,
            name: 'Calendar'
          }]
        },
        events: {
          rows: [{
            id: 1,
            resourceId: 1,
            name: 'All day 1',
            startDate: '2019-10-14',
            endDate: '2019-10-15',
            duration: 1,
            durationUnit: 'd',
            allDay: true
          }, {
            id: 2,
            resourceId: 1,
            name: 'All day 2',
            startDate: '2019-10-14',
            endDate: '2019-10-15',
            duration: 1,
            durationUnit: 'd',
            allDay: true
          }, {
            id: 3,
            resourceId: 1,
            name: 'All day 3',
            startDate: '2019-10-14',
            endDate: '2019-10-15',
            duration: 1,
            durationUnit: 'd',
            allDay: true
          }, {
            id: 4,
            resourceId: 1,
            name: 'All day 4',
            startDate: '2019-10-14',
            endDate: '2019-10-15',
            duration: 1,
            durationUnit: 'd',
            allDay: true
          }, {
            id: 5,
            resourceId: 1,
            name: 'All day 5',
            startDate: '2019-10-14',
            endDate: '2019-10-15',
            duration: 1,
            durationUnit: 'd',
            allDay: true
          }]
        }
      })
    });
    calendar = await t.getCalendar({
      crudManager: {
        transport: {
          load: {
            url: 'delayed-allday-events'
          }
        },
        autoLoad: true,
        autoSync: false
      },
      date: new Date(2019, 9, 14),
      project: new ProjectModel(),
      // This height makes it impossible to do the initial scroll to 7am
      // because the client height available won't get it there.
      // After some stacked all day events arrive though, it becomes possible
      // so it gets another bite.
      height: 918
    });
    t.is(calendar.mode, 'week', 'Week view set initially');
    t.is(calendar.activeView.visibleStartTime, 7, 'Reasonable default set as visibleStartTime'); // This should just wait until after the events arrive, and make the day content
    // clientHeight smaller and the view gets one more go at scrolling to its start time.

    await t.waitFor(() => {
      const cell7AM = t.query('.b-weekview .b-dayview-timeaxis-time:contains(7)')[0],
            cell7AMRect = t.rect(cell7AM);
      return Math.abs(cell7AMRect.top + cell7AMRect.height / 2 - t.rect('.b-weekview .b-dayview-allday-row-start').bottom) < 5;
    });
  });
  t.it('Should support scrolling to a date', async t => {
    calendar = await t.getCalendar({
      date: new Date(2019, 9, 14),
      project: new ProjectModel(),
      modes: {
        agenda: null,
        month: null,
        year: null,
        week: {
          hourHeight: 70
        }
      }
    });
    await t.waitForSelectorNotFound('.b-scrolling');
    const weekView = calendar.activeView;
    t.is(weekView.getPositionFromTime(0), 0, 'getPositionFromTime 0');
    t.is(weekView.getPositionFromTime(1), 70 * 1, 'getPositionFromTime 1');
    t.is(weekView.getPositionFromTime(2), 70 * 2, 'getPositionFromTime 2');
    t.is(weekView.getPositionFromTime(5), 70 * 5, 'getPositionFromTime 5');
    t.is(weekView.getPositionFromTime(7), 70 * 7, 'getPositionFromTime 7');
    await weekView.scrollTo(new Date(2019, 9, 14, 11));
    const cell11AM = t.query('.b-weekview .b-dayview-timeaxis-time:nth-child(11)')[0];
    const cell11AMRect = t.rect(cell11AM);
    t.isApprox(cell11AMRect.top + cell11AMRect.height / 2, t.rect('.b-weekview .b-dayview-allday-row-start').bottom, 7, '11am scrolled into view');
  });
  t.it('Should support scrolling to an hour number', async t => {
    calendar = await t.getCalendar({
      date: new Date(2019, 9, 14),
      project: new ProjectModel(),
      modes: {
        agenda: null,
        month: null,
        year: null,
        week: {
          hourHeight: 70
        }
      }
    });
    await t.waitForSelectorNotFound('.b-scrolling');
    const weekView = calendar.activeView;
    const cell10AM = t.query('.b-weekview .b-dayview-timeaxis-time:nth-child(10)')[0];
    await weekView.scrollTo(10);
    const cell10AMRect = t.rect(cell10AM);
    t.isApprox(cell10AMRect.top + cell10AMRect.height / 2, t.rect('.b-weekview .b-dayview-allday-row-start').bottom, 6, '10am scrolled into view');
  });
  t.it('Should support scrolling to an event record', async t => {
    calendar = await t.getCalendar({
      date: new Date(2019, 9, 14),
      project: new ProjectModel(),
      modes: {
        agenda: null,
        month: null,
        year: null,
        week: {
          hourHeight: 70
        }
      }
    });
    await t.waitForSelectorNotFound('.b-scrolling');
    calendar.project.eventStore.add({
      startDate: new Date(2019, 9, 14, 13),
      duration: 1,
      durationUnit: 'h'
    }); // Wait for event's element to be there

    await t.waitForSelector('.b-cal-event-wrap');
    const weekView = calendar.activeView,
          event = calendar.project.eventStore.first;
    await weekView.scrollTo(event, {
      animate: false,
      block: 'start'
    });
    const eventBox = t.rect('.b-weekview .b-cal-event');
    t.isApprox(eventBox.top, t.rect('.b-weekview .b-dayview-allday-row-start').bottom, 5, 'Event scrolled into view');
  });
});