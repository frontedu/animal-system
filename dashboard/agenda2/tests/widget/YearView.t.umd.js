"use strict";

StartTest(t => {
  // eslint-disable-next-line no-unused-vars
  let calendar, yearView, eventStore, resourceStore;

  async function getYearView(config) {
    const yearView = t.getYearView(config);
    eventStore = yearView.eventStore;
    resourceStore = yearView.resourceStore;
    return yearView;
  }

  t.beforeEach(() => {
    var _calendar;

    yearView && !yearView.isDestroyed && yearView.destroy();
    (_calendar = calendar) === null || _calendar === void 0 ? void 0 : _calendar.destroy(); // Check that none of the floating things are persisting

    if (t.query('.b-overflowpopup,.b-sch-event-tooltip, .b-eventeditor').length > 0) {
      t.selectorNotExists('.b-overflowpopup:visible');
      t.selectorNotExists('.b-sch-event-tooltip');
      t.selectorNotExists('.b-eventeditor');
    }
  });
  t.it('sanity', async t => {
    const waitForRefresh = async max => {
      // Check for one or max refreshes count, but not more.
      // Wait for one happened and then check if there were not more than max refreshes after delay.
      await t.waitFor(() => yearView.refreshCount >= refreshCount + 1);
      await t.waitFor(100);
      t.ok(yearView.refreshCount <= refreshCount + max);
      refreshCount = yearView.refreshCount;
    };

    eventStore = new EventStore({
      data: t.getHackathonData().events.rows
    }); // eslint-disable-next-line no-undef

    resourceStore = new ResourceStore({
      data: t.getHackathonData().resources.rows
    });
    const yearViewEvents = [];
    yearView = await getYearView({
      weekStartDay: 0,
      eventStore,
      resourceStore
    });
    await t.waitForProjectReady(yearView);
    let refreshCount = yearView.refreshCount;
    t.hasCls(yearView.getCell(new Date()), yearView.todayCls, 'Today class applied to correct cell');
    yearView.month.year = 2019;
    await waitForRefresh(1); // Check that all cell widths are the same

    const cellWidths = t.query('.b-yearview .b-calendar-cell').map(e => e.getBoundingClientRect().width);
    t.ok(cellWidths.every((w, i) => !i || t.samePx(w, cellWidths[i - 1]))); // February starts on a Sunday in 2015, so will only have 4 weeks with weekStartDay = 0.

    yearView.month.year = 2015;
    await waitForRefresh(1);
    t.selectorNotExists(`.${yearView.todayCls}`, 'No today class on past year');
    t.selectorCountIs('.b-week-number-cell', 12 * 7, 'Correct week cell count'); // No events at present

    t.selectorNotExists('.b-cal-cell-overflow');
    t.selectorCountIs('.b-calendar-week[data-week="2014,53"] .b-calendar-cell.b-other-month', 4, '28, 29, 30, 31 are all "Other month"');
    t.selectorCountIs('.b-calendar-week[data-week="2014,53"] .b-calendar-cell:not(.b-other-month)', 3, '1, 2 and 3 are all this month');
    t.selectorCountIs('.b-calendar-week[data-week="2015,9"]  .b-calendar-cell.b-other-month', 7, '5th week of feb is all "Other month"');
    t.selectorCountIs('.b-calendar-week[data-week="2015,10"] .b-calendar-cell.b-other-month', 7, '6th week of feb is all "Other month"'); // eslint-disable-next-line no-unused-vars

    const firstJanEvent = yearView.eventStore.add({
      startDate: new Date(2015, 0, 1),
      endDate: new Date(2015, 0, 4),
      name: 'Conference'
    })[0];
    await waitForRefresh(2);
    refreshCount = yearView.refreshCount;
    t.selectorCountIs('.b-cal-cell-overflow', 3, 'Three event bearing cells in year');
    t.selectorCountIs('.b-cal-cell-overflow.b-datepicker-1-to-3-events', 3, 'One event spanning three cells'); // eslint-disable-next-line no-unused-vars

    const secondJanEvents = yearView.eventStore.add([{
      startDate: new Date(2015, 0, 2, 9),
      endDate: new Date(2015, 0, 2, 10),
      name: 'Breakfast'
    }, {
      startDate: new Date(2015, 0, 2, 10),
      endDate: new Date(2015, 0, 2, 11),
      name: 'Keynote'
    }, {
      startDate: new Date(2015, 0, 2, 11),
      endDate: new Date(2015, 0, 2, 12),
      name: 'Session 1'
    }]);
    await waitForRefresh(2);
    refreshCount = yearView.refreshCount;
    t.selectorCountIs('.b-cal-cell-overflow', 3, 'Three event bearing cells in year');
    t.selectorCountIs('.b-cal-cell-overflow.b-datepicker-1-to-3-events', 2, 'Two cells with 1 to 3 events');
    t.selectorCountIs('.b-cal-cell-overflow.b-datepicker-4-to-6-events', 1, 'One cell with more than 3 events');
    const thirdJanEvents = yearView.eventStore.add([{
      startDate: new Date(2015, 0, 3, 9),
      endDate: new Date(2015, 0, 3, 10),
      name: 'Breakfast'
    }, {
      startDate: new Date(2015, 0, 3, 10),
      endDate: new Date(2015, 0, 3, 11),
      name: 'Session 1'
    }, {
      startDate: new Date(2015, 0, 3, 11),
      endDate: new Date(2015, 0, 3, 12),
      name: 'Session 1'
    }, {
      startDate: new Date(2015, 0, 3, 12),
      endDate: new Date(2015, 0, 3, 13),
      name: 'Gym'
    }, {
      startDate: new Date(2015, 0, 3, 13),
      endDate: new Date(2015, 0, 3, 14),
      name: 'Lunch'
    }, {
      startDate: new Date(2015, 0, 3, 18),
      endDate: new Date(2015, 0, 3, 19),
      name: 'Dinner'
    }]);
    await waitForRefresh(2);
    t.selectorCountIs('.b-cal-cell-overflow', 3, 'Three event bearing cells in year');
    t.selectorCountIs('.b-cal-cell-overflow.b-datepicker-1-to-3-events', 1, 'One event in its own cell');
    t.selectorCountIs('.b-cal-cell-overflow.b-datepicker-4-to-6-events', 1, '4 events in their own cell');
    t.selectorCountIs('.b-cal-cell-overflow.b-calendar-7-or-more-events', 1, '7 events in their own cell');
    yearView.on({
      catchAll(e) {
        if (e.type.toLowerCase().endsWith('click')) {
          yearViewEvents.push(e);
        }
      }

    });
    t.chain({
      click: '.b-calendar-week[data-week="2014,53"] .b-week-number-cell'
    }, {
      click: '.b-calendar-week[data-week="2015,1"] .b-week-number-cell'
    }, {
      click: '.b-calendar-week[data-week="2015,52"] .b-week-number-cell'
    }, {
      click: '.b-calendar-week[data-week="2016,1"] .b-week-number-cell'
    }, next => {
      t.isDeeply(yearViewEvents[0].week, [2014, 53]);
      t.isDeeply(yearViewEvents[1].week, [2015, 1]);
      t.isDeeply(yearViewEvents[2].week, [2015, 52]);
      t.isDeeply(yearViewEvents[3].week, [2016, 1]);
      yearViewEvents.length = 0;
      next();
    }, {
      click: '.b-calendar-cell[data-date="2015-01-03"]'
    }, {
      waitFor: () => yearView.overflowPopup.isVisible
    }, next => {
      t.selectorCountIs('.b-cal-event-wrap', 7);
      next();
    }, {
      click: '.b-cal-event-body:contains(Breakfast)'
    }, next => {
      t.is(yearViewEvents[0].date, new Date(2015, 0, 3));
      t.is(yearViewEvents[0].type, 'celloverflowclick');
      t.is(yearViewEvents[1].eventRecord, thirdJanEvents[0]);
      t.is(yearViewEvents[1].type, 'eventclick');
      yearViewEvents.length = 0;
      next();
    }, {
      click: '.b-calendar-cell[data-date="2015-03-01"]:not(.b-other-month)'
    }, () => {
      t.is(yearViewEvents[0].date, new Date(2015, 2, 1));
      t.is(yearViewEvents[0].type, 'daynumberclick');
      t.is(yearViewEvents[1].date, new Date(2015, 2, 1));
      t.is(yearViewEvents[1].type, 'scheduleclick');
    });
  });
  t.it('Events must not display in "other month"', async t => {
    eventStore = new EventStore({
      data: [{
        startDate: '2000-03-11T:09:00',
        endDate: '2000-03-11T:10:00',
        name: '11th March',
        resourceId: 'bryntum'
      }]
    }); // eslint-disable-next-line no-undef

    resourceStore = new ResourceStore({
      data: t.getHackathonData().resources.rows
    });
    yearView = await getYearView({
      weekStartDay: 0,
      eventStore,
      resourceStore,
      year: 2000
    });
    t.selectorCountIs('.b-calendar-cell.b-cal-cell-overflow.b-datepicker-1-to-3-events', 1, 'Event only shown in its own month');
    t.chain( // Click overflowing cell
    {
      click: '.b-calendar-cell.b-cal-cell-overflow.b-datepicker-1-to-3-events'
    }, {
      waitFor: () => yearView.overflowPopup.isVisible
    }, next => {
      // When we click the cell again, it must not hide
      t.wontFire(yearView.overflowPopup, 'hide');
      t.is(yearView.overflowPopup.lastAlignSpec.target, yearView.contentElement.querySelector('.b-calendar-cell.b-cal-cell-overflow.b-datepicker-1-to-3-events:not(.b-other-month)'), 'Popup aligned correctly');
      next();
    }, // Click overflowing cell again.
    {
      click: '.b-calendar-cell.b-cal-cell-overflow.b-datepicker-1-to-3-events'
    }, () => {
      t.ok(yearView.overflowPopup.isVisible, 'Clicking the overflowing cell again correctly left the overflow popup visible');
    });
  });
  t.it('createEvent() on YearView', async t => {
    eventStore = new EventStore({
      data: [],
      defaultCalendarId: 'r2'
    });
    resourceStore = new ResourceStore({
      data: [{
        id: 'r1',
        name: 'Calendar 1'
      }, {
        id: 'r2',
        name: 'Calendar 2'
      }]
    });
    calendar = await t.getCalendar({
      date: new Date(2019, 9, 7),
      eventStore,
      resourceStore,
      sidebar: false,
      features: {
        eventTooltip: false,
        eventEdit: false
      },
      mode: 'year',
      modes: {
        agenda: null,
        day: null,
        month: null
      }
    });
    t.selectorCountIs('.b-cal-event-wrap', 0, 'No events'); // A programmatic call should end up delegating it to the WeekView

    calendar.modes.year.createEvent(new Date(2019, 9, 7));
    t.chain({
      waitFor: () => {
        var _calendar$eventStore$;

        return ((_calendar$eventStore$ = calendar.eventStore.first) === null || _calendar$eventStore$ === void 0 ? void 0 : _calendar$eventStore$.resource) === calendar.defaultCalendar;
      }
    }, // Event rendered in week view
    {
      waitForSelector: '.b-dayview-day-detail.b-calendar-cell .b-cal-event-wrap'
    }, next => {
      t.is(calendar.eventStore.count, 1);
      t.selectorCountIs('.b-cal-event-wrap', 1, '1 event');
      const newEvent = calendar.eventStore.first;
      t.is(newEvent.startDate, new Date(2019, 9, 7, 8), 'Correct start date');
      t.is(newEvent.endDate, new Date(2019, 9, 7, 9), 'Correct end date');
      t.is(newEvent.resource, calendar.resourceStore.getAt(1), 'Correct resource');
      calendar.autoCreate = false;
      next();
    }, {
      dblclick: '.b-cal-cell-header[data-header-date="2019-10-08"]'
    }, () => {
      t.is(calendar.eventStore.count, 1, 'Still one event, autoCreate disabled');
      t.selectorCountIs('.b-cal-event-wrap', 1, 'Still one event, autoCreate disabled');
    });
  });
  t.it('autoCreate gesture in YearView', async t => {
    eventStore = new EventStore({
      data: [],
      defaultCalendarId: 'r2'
    });
    resourceStore = new ResourceStore({
      data: [{
        id: 'r1',
        name: 'Calendar 1'
      }, {
        id: 'r2',
        name: 'Calendar 2'
      }]
    });
    calendar = await t.getCalendar({
      date: new Date(2019, 9, 7),
      eventStore,
      resourceStore,
      sidebar: false,
      features: {
        eventTooltip: false,
        eventEdit: false
      },
      mode: 'year',
      modes: {
        agenda: null,
        day: null,
        month: null,
        year: {
          autoCreate: true
        }
      }
    });
    t.selectorCountIs('.b-cal-event-wrap', 0, 'No events');
    t.chain( // The autoCreate gesture should end up delegating it to the WeekView
    {
      dblclick: '.b-calendar-cell[data-date="2019-10-07"]'
    }, // Event rendered in week view
    {
      waitForSelector: '.b-dayview-day-detail.b-calendar-cell .b-cal-event-wrap'
    }, next => {
      t.is(calendar.eventStore.count, 1);
      t.selectorCountIs('.b-cal-event-wrap', 1, '1 event');
      const newEvent = calendar.eventStore.first;
      t.is(newEvent.startDate, new Date(2019, 9, 7, 8), 'Correct start date');
      t.is(newEvent.endDate, new Date(2019, 9, 7, 9), 'Correct end date');
      t.is(newEvent.resource, calendar.resourceStore.getAt(1), 'Correct resource');
      calendar.autoCreate = false;
      next();
    }, {
      dblclick: '.b-cal-cell-header[data-header-date="2019-10-08"]'
    }, () => {
      t.is(calendar.eventStore.count, 1, 'Still one event, autoCreate disabled');
      t.selectorCountIs('.b-cal-event-wrap', 1, 'Still one event, autoCreate disabled');
    });
  });
  t.it('Click on YearView\'s week cell should go to that week', async t => {
    eventStore = new EventStore({
      data: t.getHackathonData().events.rows
    });
    resourceStore = new ResourceStore({
      data: t.getHackathonData().resources.rows
    });
    calendar = await t.getCalendar({
      date: new Date(2019, 9, 14),
      eventStore,
      resourceStore,
      mode: 'week'
    }); // We must start on another week than the week we plan to try to drill into.
    // The bug was that YearView's date was '2019-10-14'. Calendar syncs the
    // incoming card's date with the outgoing card's date in a beforeCardChange
    // listener. Fix is that we ensure that when clicking areas in a view, that
    // view updates its date to where the user is interested in.
    // Testing locale uses Sunday 13th.

    t.is(calendar.modes.week.startDate, new Date(2019, 9, 13));
    await t.click('[data-ref="yearShowButton"]');
    await t.click('.b-week-number-cell:textEquals(14)'); // Should have gone to week 14, not the date that YearView was navigated to.

    t.is(calendar.modes.week.startDate, new Date(2019, 2, 31));
    t.isDeeply(calendar.modes.week.week, [2019, 14]);
  });
  t.it('YearView dblclick handling with autoCreate false', async t => {
    eventStore = new EventStore({
      data: t.getHackathonData().events.rows
    });
    resourceStore = new ResourceStore({
      data: t.getHackathonData().resources.rows
    });
    calendar = await t.getCalendar({
      date: new Date(2019, 9, 14),
      eventStore,
      resourceStore,
      mode: 'year'
    });
    await t.doubleClick('[data-date="2019-02-19"]'); // Wait for animated card change

    await t.waitForAnimations(); // We are waiting for nothing to happen. The dblclick to initiate event edit
    // should NOT happen because YearView has autoCreate as false by default,
    // so we have to wait to allow any bug to happen.

    await t.waitFor(500);
    t.is(calendar.mode, 'week', 'Correctly switched mode');
    t.is(calendar.modes.week.date, new Date(2019, 1, 19), 'Moved to selected date');
    t.is(calendar.modes.week.startDate, new Date(2019, 1, 17), 'Moved to selected date');
    t.notOk(calendar.features.eventEdit._editor, 'Editing correctly not started');
  });
  t.it('YearView dblclick handling with autoCreate true', async t => {
    eventStore = new EventStore({
      data: t.getHackathonData().events.rows
    });
    resourceStore = new ResourceStore({
      data: t.getHackathonData().resources.rows
    });
    calendar = await t.getCalendar({
      date: new Date(2019, 9, 14),
      eventStore,
      resourceStore,
      mode: 'year',
      modes: {
        year: {
          autoCreate: true
        }
      }
    });
    const {
      week
    } = calendar.modes,
          {
      eventEdit
    } = calendar.features;
    await t.doubleClick('[data-date="2019-02-19"]'); // Wait for animated card change

    await t.waitForAnimations(); // Editing should be started

    await t.waitFor(() => {
      var _eventEdit$editor;

      return (_eventEdit$editor = eventEdit.editor) === null || _eventEdit$editor === void 0 ? void 0 : _eventEdit$editor.containsFocus;
    });
    t.is(eventEdit.editor.record.startDate, new Date(2019, 1, 19, week.autoCreate.startHour), 'Edit started at configured date');
    t.is(eventEdit.editor.lastAlignSpec.target, week.getEventElement(eventEdit.editor.record), 'Editor aligned to event');
    t.is(calendar.mode, 'week', 'Correctly switched mode');
    t.is(week.date, new Date(2019, 1, 19), 'Moved to selected date');
    t.is(week.startDate, new Date(2019, 1, 17), 'Moved to selected date');
  }); // https://github.com/bryntum/support/issues/2485

  t.it('Should support cellRenderer', async t => {
    yearView = await getYearView({
      date: new Date(2021, 0, 1),
      eventStore: new EventStore({
        data: [{
          id: 1,
          startDate: new Date(2021, 10, 14),
          endDate: new Date(2021, 10, 21),
          name: 'Hackathon 2021'
        }]
      }),
      // eslint-disable-next-line no-undef
      resourceStore: new ResourceStore({
        data: t.getHackathonData().resources.rows
      }),

      dayCellRenderer({
        cellConfig,
        events,
        date
      }) {
        if (date - new Date(2021, 0, 5) === 0) {
          cellConfig.style.color = '#fff';
          cellConfig.style.backgroundColor = '#000';
          cellConfig.className.black = 1;
          return 'F';
        }

        if (date - new Date(2021, 10, 15) === 0) {
          t.is(events.length, 1, '1 event');
          t.is(events[0], this.eventStore.first, 'Correct event');
        }
      }

    });
    await t.waitForSelector('.black[data-date="2021-01-05"]:textEquals(F)');
    t.selectorCountIs('.black', 1, '1 cell made black');
  });
  t.it('reconfiguring overflowPopup', async t => {
    eventStore = t.getEventStore({
      data: [{
        id: 'event1',
        cls: 'event1',
        resourceId: 'r1',
        name: 'Assignment 1',
        color: 'red',
        startDate: new Date(2011, 0, 10, 9),
        endDate: new Date(2011, 0, 10, 10),
        allDay: true
      }, {
        id: 'event2',
        cls: 'event2',
        resourceId: 'r1',
        name: 'Assignment 2',
        color: '#f1c114',
        startDate: new Date(2011, 0, 10, 10),
        endDate: new Date(2011, 0, 10, 11),
        allDay: true
      }, {
        id: 'event3',
        cls: 'event3',
        resourceId: 'r1',
        name: 'Assignment 3',
        color: 'green',
        startDate: new Date(2011, 0, 10, 11),
        endDate: new Date(2011, 0, 10, 12),
        allDay: true
      }, {
        id: 'event4',
        cls: 'event4',
        resourceId: 'r1',
        name: 'Assignment 4',
        color: 'blue',
        startDate: new Date(2011, 0, 10, 12),
        endDate: new Date(2011, 0, 10, 13),
        allDay: true
      }, {
        id: 'event5',
        cls: 'event5',
        resourceId: 'r1',
        name: 'Assignment 5',
        color: 'indigo',
        startDate: new Date(2011, 0, 10, 13),
        endDate: new Date(2011, 0, 10, 14),
        allDay: true
      }]
    });
    resourceStore = t.getResourceStore({
      data: [{
        id: 'r1',
        name: 'Mike',
        eventColor: 'red'
      }]
    });
    calendar = await t.getCalendar({
      eventStore,
      resourceStore,
      sidebar: false,
      width: 1000,
      height: 750,
      date: new Date(2011, 0, 10),
      mode: 'year',
      modes: {
        year: {
          overflowPopup: {
            eventList: false,
            items: {
              testWidget: {
                cls: 'test-class',
                html: 'There is overflow'
              }
            }
          }
        }
      }
    });
    t.firesOnce(calendar.modes.year, 'showOverflowPopup');
    await t.click('.b-cal-cell-overflow'); // Popup is there with extra content

    await t.waitForSelector('.b-overflowpopup .test-class:contains(There is overflow)'); // eventList has been configured away

    t.selectorNotExists('.b-overflowpopup [data-ref="eventList"]'); // WeekView exposes the overflowPopup from its allDayEvents as a convenience

    t.ok(calendar.modes.week.overflowPopup.isOverflowPopup);
  });
  t.it('vetoing overflowPopup', async t => {
    eventStore = t.getEventStore({
      data: [{
        id: 'event1',
        cls: 'event1',
        resourceId: 'r1',
        name: 'Assignment 1',
        color: 'red',
        startDate: new Date(2011, 0, 10, 9),
        endDate: new Date(2011, 0, 10, 10),
        allDay: true
      }, {
        id: 'event2',
        cls: 'event2',
        resourceId: 'r1',
        name: 'Assignment 2',
        color: '#f1c114',
        startDate: new Date(2011, 0, 10, 10),
        endDate: new Date(2011, 0, 10, 11),
        allDay: true
      }, {
        id: 'event3',
        cls: 'event3',
        resourceId: 'r1',
        name: 'Assignment 3',
        color: 'green',
        startDate: new Date(2011, 0, 10, 11),
        endDate: new Date(2011, 0, 10, 12),
        allDay: true
      }, {
        id: 'event4',
        cls: 'event4',
        resourceId: 'r1',
        name: 'Assignment 4',
        color: 'blue',
        startDate: new Date(2011, 0, 10, 12),
        endDate: new Date(2011, 0, 10, 13),
        allDay: true
      }, {
        id: 'event5',
        cls: 'event5',
        resourceId: 'r1',
        name: 'Assignment 5',
        color: 'indigo',
        startDate: new Date(2011, 0, 10, 13),
        endDate: new Date(2011, 0, 10, 14),
        allDay: true
      }]
    });
    resourceStore = t.getResourceStore({
      data: [{
        id: 'r1',
        name: 'Mike',
        eventColor: 'red'
      }]
    });
    calendar = await t.getCalendar({
      eventStore,
      resourceStore,
      sidebar: false,
      width: 1000,
      height: 750,
      date: new Date(2011, 0, 10),
      mode: 'year',
      modes: {
        year: {
          overflowPopup: {
            eventList: false,
            items: {
              testWidget: {
                cls: 'test-class',
                html: 'There is overflow'
              }
            }
          },
          listeners: {
            beforeShowOverflowPopup() {
              return false;
            }

          }
        }
      }
    });
    await t.click('.b-cal-cell-overflow'); // Wait for any erroneous show of the overflow popup

    await t.waitFor(100); // Popup is not visible. It gets rendered because the showOverflowPopup event includes it

    t.selectorNotExists('.b-overflowpopup:visible');
  });
  t.it('overflowPopup configured away', async t => {
    eventStore = t.getEventStore({
      data: [{
        id: 'event1',
        cls: 'event1',
        resourceId: 'r1',
        name: 'Assignment 1',
        color: 'red',
        startDate: new Date(2011, 0, 10, 9),
        endDate: new Date(2011, 0, 10, 10),
        allDay: true
      }, {
        id: 'event2',
        cls: 'event2',
        resourceId: 'r1',
        name: 'Assignment 2',
        color: '#f1c114',
        startDate: new Date(2011, 0, 10, 10),
        endDate: new Date(2011, 0, 10, 11),
        allDay: true
      }, {
        id: 'event3',
        cls: 'event3',
        resourceId: 'r1',
        name: 'Assignment 3',
        color: 'green',
        startDate: new Date(2011, 0, 10, 11),
        endDate: new Date(2011, 0, 10, 12),
        allDay: true
      }, {
        id: 'event4',
        cls: 'event4',
        resourceId: 'r1',
        name: 'Assignment 4',
        color: 'blue',
        startDate: new Date(2011, 0, 10, 12),
        endDate: new Date(2011, 0, 10, 13),
        allDay: true
      }, {
        id: 'event5',
        cls: 'event5',
        resourceId: 'r1',
        name: 'Assignment 5',
        color: 'indigo',
        startDate: new Date(2011, 0, 10, 13),
        endDate: new Date(2011, 0, 10, 14),
        allDay: true
      }]
    });
    resourceStore = t.getResourceStore({
      data: [{
        id: 'r1',
        name: 'Mike',
        eventColor: 'red'
      }]
    });
    calendar = await t.getCalendar({
      eventStore,
      resourceStore,
      sidebar: false,
      width: 1000,
      height: 750,
      date: new Date(2011, 0, 10),
      mode: 'year',
      modes: {
        year: {
          overflowPopup: null
        }
      }
    });
    await t.click('.b-cal-cell-overflow'); // Wait for any erroneous show of the overflow popup

    await t.waitFor(100); // Popup is not there

    t.selectorNotExists('.b-overflowpopup');
  });
  t.it('overflowPopup with eventRenderer', async t => {
    eventStore = t.getEventStore({
      data: [{
        id: 'event1',
        cls: 'event1',
        resourceId: 'r1',
        name: 'Assignment 1',
        color: 'red',
        startDate: new Date(2011, 0, 9),
        endDate: new Date(2011, 0, 12),
        allDay: true
      }, {
        id: 'event2',
        cls: 'event2',
        resourceId: 'r1',
        name: 'Assignment 2',
        color: '#f1c114',
        startDate: new Date(2011, 0, 9),
        endDate: new Date(2011, 0, 11),
        allDay: true
      }, {
        id: 'event3',
        cls: 'event3',
        resourceId: 'r1',
        name: 'Assignment 3',
        color: 'green',
        startDate: new Date(2011, 0, 10),
        endDate: new Date(2011, 0, 12),
        allDay: true
      }, {
        id: 'event4',
        cls: 'event4',
        resourceId: 'r1',
        name: 'Assignment 4',
        color: 'blue',
        startDate: new Date(2011, 0, 10, 12),
        endDate: new Date(2011, 0, 10, 13),
        allDay: true
      }, {
        id: 'event5',
        cls: 'event5',
        resourceId: 'r1',
        name: 'Assignment 5',
        color: 'indigo',
        startDate: new Date(2011, 0, 10, 13),
        endDate: new Date(2011, 0, 10, 14),
        allDay: true
      }]
    });
    const e1 = eventStore.first,
          e2 = eventStore.getAt(1),
          e3 = eventStore.getAt(2),
          e4 = eventStore.getAt(3),
          e5 = eventStore.getAt(4);
    resourceStore = t.getResourceStore({
      data: [{
        id: 'r1',
        name: 'Mike',
        eventColor: 'red'
      }]
    });
    calendar = await t.getCalendar({
      eventStore,
      resourceStore,
      sidebar: false,
      width: 1000,
      height: 750,
      date: new Date(2011, 0, 9),
      mode: 'year',
      modes: {
        year: {
          overflowPopup: {
            eventRenderer({
              eventRecord,
              renderData
            }) {
              renderData.cls['b-overflow-event'] = 1;
            }

          }
        }
      }
    });
    const yearView = calendar.activeView;
    await t.click('.b-cal-cell-overflow[data-date="2011-01-10"]'); // Wait for custom rendered events

    await t.waitForSelector('.b-overflowpopup .b-cal-event-wrap.b-overflow-event');
    t.selectorCountIs('.b-overflowpopup .b-cal-event-wrap.b-overflow-event', 5); // Must have correct classes

    t.selectorExists(`#${yearView.overflowPopup.element.id} .b-cal-event-wrap.b-allday[data-event-id="${e1.id}"].b-continues-left.b-continues-right:contains(${e1.name})`);
    t.selectorExists(`#${yearView.overflowPopup.element.id} .b-cal-event-wrap.b-allday[data-event-id="${e2.id}"].b-continues-left:not(.b-continues-right):contains(${e2.name})`);
    t.selectorExists(`#${yearView.overflowPopup.element.id} .b-cal-event-wrap.b-allday[data-event-id="${e3.id}"]:not(.b-continues-left).b-continues-right:contains(${e3.name})`);
    t.selectorExists(`#${yearView.overflowPopup.element.id} .b-cal-event-wrap.b-allday[data-event-id="${e4.id}"]:not(.b-continues-left):not(.b-continues-right):contains(${e4.name})`);
    t.selectorExists(`#${yearView.overflowPopup.element.id} .b-cal-event-wrap.b-allday[data-event-id="${e5.id}"]:not(.b-continues-left):not(.b-continues-right):contains(${e5.name})`);
    await t.click(yearView.overflowPopup.titleElement);
    await t.waitForAnimations();
    t.is(calendar.mode, 'day');
    t.is(calendar.date, new Date(2011, 0, 10));
  }); // https://github.com/bryntum/support/issues/3922

  t.it('hideNonWorkingDays', async t => {
    eventStore = new EventStore({
      data: t.getHackathonData().events.rows
    }); // eslint-disable-next-line no-undef

    resourceStore = new ResourceStore({
      data: t.getHackathonData().resources.rows
    });
    yearView = await getYearView({
      weekStartDay: 0,
      eventStore,
      resourceStore,
      hideNonWorkingDays: true
    }); // Nonworking days not visible

    t.selectorNotExists('.b-nonworking-day:visible');
  });
});