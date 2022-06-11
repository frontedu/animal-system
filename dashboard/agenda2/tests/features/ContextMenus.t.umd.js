"use strict";

StartTest(t => {
  // eslint-disable-next-line no-unused-vars
  let calendar, eventStore, resourceStore, agenda, year, month, week, day, duplicates, extraCount;

  async function getCalendar(config) {
    const calendar = await t.getCalendar(Objects.merge({
      features: {
        eventMenu: {
          items: {
            duplicate: {
              text: 'Duplicate',
              icon: 'b-fa b-fa-clone',
              // Handler found by looking up ownership hierarchy.
              // Will find an implementation in the Calendar
              onItem: 'up.duplicateEvent'
            }
          }
        },
        scheduleMenu: {
          items: {
            extra: {
              text: 'Extra function',
              icon: 'b-fa b-fa-anchor',
              // Handler found by looking up ownership hierarchy.
              // Will find an implementation in the Calendar
              onItem: 'up.extraScheduleHandler'
            }
          }
        }
      },

      duplicateEvent({
        eventRecord
      }) {
        duplicates.push(eventRecord);
      },

      extraScheduleHandler() {
        extraCount++;
      }

    }, config));
    eventStore = calendar.eventStore;
    resourceStore = calendar.resourceStore;
    duplicates = [];
    extraCount = 0; // eslint-disable-next-line no-unused-vars

    ({
      agenda,
      year,
      month,
      week,
      day
    } = calendar.modes); // Wait for the DOM to have layed out so that a turbo mode mousemove triggers a mouseover

    await t.waitForAnimationFrame();
    return calendar;
  }

  t.beforeEach(function () {
    var _calendar;

    (_calendar = calendar) === null || _calendar === void 0 ? void 0 : _calendar.destroy(); // Check that none of the floating things are persisting

    if (t.query('.b-overflowpopup:visible,.b-sch-event-tooltip, .b-eventeditor, .b-menu').length > 0) {
      t.selectorNotExists('.b-overflowpopup:visible');
      t.selectorNotExists('.b-sch-event-tooltip');
      t.selectorNotExists('.b-eventeditor');
      t.selectorNotExists('.b-menu');
    }
  });
  t.it('DayView', async t => {
    eventStore = new EventStore({
      data: t.getHackathonData().events.rows
    });
    resourceStore = new ResourceStore({
      data: t.getHackathonData().resources.rows
    });
    calendar = await getCalendar({
      date: new Date(2019, 9, 14),
      sidebar: false,
      eventStore,
      resourceStore,
      features: {
        eventTooltip: false
      },
      mode: 'day'
    });
    let newEvent;
    t.chain( // Click just after 10:30, should snap to 10:30
    {
      rightClick: '.b-dayview-day-detail.b-calendar-cell',
      offset: ['50%', calendar.modes.day.hourHeight * 10.6]
    }, {
      click: '.b-menuitem[data-ref="addEvent"]'
    }, {
      waitFor: () => {
        var _calendar$features$ev;

        return (_calendar$features$ev = calendar.features.eventEdit.editor) === null || _calendar$features$ev === void 0 ? void 0 : _calendar$features$ev.containsFocus;
      }
    }, {
      type: 'Added event[ENTER]'
    }, next => {
      newEvent = eventStore.last;
      t.is(newEvent.name, 'Added event');
      t.is(newEvent.startDate, new Date(2019, 9, 14, 10, 30));
      next();
    }, {
      rightClick: '.b-dayview-day-detail.b-calendar-cell',
      offset: ['50%', calendar.modes.day.hourHeight * 12]
    }, {
      click: '.b-menuitem[data-ref="extra"]'
    }, next => {
      t.is(extraCount, 1);
      next();
    }, {
      rightClick: '.b-cal-event-wrap:contains(Added event)'
    }, {
      click: '.b-menuitem[data-ref="deleteEvent"]'
    }, next => {
      // Event has gone
      t.notOk(eventStore.includes(newEvent));
      next();
    }, {
      rightClick: '.b-cal-event-wrap:contains(Check-In in Hotel)'
    }, {
      click: '.b-menuitem[data-ref="duplicate"]'
    }, () => {
      // One event duplicated
      t.is(duplicates.length, 1);
    });
  });
  t.it('With processItems', async t => {
    eventStore = new EventStore({
      data: t.getHackathonData().events.rows
    });
    resourceStore = new ResourceStore({
      data: t.getHackathonData().resources.rows
    });
    calendar = await getCalendar({
      date: new Date(2019, 9, 14),
      sidebar: false,
      eventStore,
      resourceStore,
      features: {
        eventTooltip: false,
        scheduleMenu: {
          processItems: 'up.testProcessItems'
        }
      },
      mode: 'day',

      testProcessItems({
        items,
        eventRecord
      }) {
        items.extraItem = {
          text: 'Extra item',
          onItem: 'up.onExtraItemClick'
        };
      },

      onExtraItemClick() {
        passed = true;
      }

    });
    let passed;
    await t.rightClick('.b-dayview-day-detail.b-calendar-cell', null, null, ['50%', calendar.modes.day.hourHeight * 10.6]);
    await t.click('.b-menuitem[data-ref="extraItem"]');
    await t.waitFor(() => passed);
  });
  t.it('MonthView', async t => {
    eventStore = new EventStore({
      data: t.getHackathonData().events.rows
    });
    resourceStore = new ResourceStore({
      data: t.getHackathonData().resources.rows
    });
    calendar = await getCalendar({
      date: new Date(2019, 9, 14),
      sidebar: false,
      eventStore,
      resourceStore,
      features: {
        eventTooltip: false
      },
      mode: 'month'
    });
    let newEvent;
    t.chain( // Should use autoCreate's startHour
    {
      rightClick: '.b-calendar-cell[data-date="2019-10-09"]'
    }, {
      click: '.b-menuitem[data-ref="addEvent"]'
    }, {
      waitFor: () => {
        var _calendar$features$ev2;

        return (_calendar$features$ev2 = calendar.features.eventEdit.editor) === null || _calendar$features$ev2 === void 0 ? void 0 : _calendar$features$ev2.containsFocus;
      }
    }, {
      type: 'Added event[ENTER]'
    }, next => {
      newEvent = eventStore.last;
      t.is(newEvent.name, 'Added event');
      t.is(newEvent.startDate, new Date(2019, 9, 9, calendar.activeView.autoCreate.startHour));
      next();
    }, {
      rightClick: '.b-calendar-cell[data-date="2019-10-10"]'
    }, {
      click: '.b-menuitem[data-ref="extra"]'
    }, next => {
      t.is(extraCount, 1);
      next();
    }, {
      rightClick: '.b-cal-event-wrap:contains(Added event)'
    }, {
      click: '.b-menuitem[data-ref="deleteEvent"]'
    }, next => {
      // Event has gone
      t.notOk(eventStore.includes(newEvent));
      next();
    }, {
      rightClick: '.b-cal-event-wrap:contains(Relax and official arrival beer)'
    }, {
      click: '.b-menuitem[data-ref="duplicate"]'
    }, () => {
      // One event duplicated
      t.is(duplicates.length, 1);
    });
  });
  t.it('YearView', async t => {
    eventStore = new EventStore({
      data: t.getHackathonData().events.rows
    });
    resourceStore = new ResourceStore({
      data: t.getHackathonData().resources.rows
    });
    calendar = await getCalendar({
      date: new Date(2019, 9, 14),
      sidebar: false,
      eventStore,
      resourceStore,
      features: {
        eventTooltip: false
      },
      mode: 'year'
    });
    let newEvent;
    t.chain( // Should use autoCreate's startHour
    {
      rightClick: '.b-yearview-content .b-calendar-cell[data-date="2019-10-09"]'
    }, {
      click: '.b-menuitem[data-ref="addEvent"]'
    }, {
      waitFor: () => {
        var _calendar$features$ev3;

        return (_calendar$features$ev3 = calendar.features.eventEdit.editor) === null || _calendar$features$ev3 === void 0 ? void 0 : _calendar$features$ev3.containsFocus;
      }
    }, {
      type: 'Added event[ENTER]'
    }, next => {
      newEvent = eventStore.last;
      t.is(newEvent.name, 'Added event');
      t.is(newEvent.startDate, new Date(2019, 9, 9, calendar.activeView.autoCreate.startHour));
      next();
    }, {
      click: '[data-ref="yearShowButton"]'
    }, {
      rightClick: '.b-yearview-content .b-calendar-cell[data-date="2019-10-10"]'
    }, {
      click: '.b-menuitem[data-ref="extra"]'
    }, () => {
      t.is(extraCount, 1);
    });
  });
  t.it('AgendaView', async t => {
    eventStore = new EventStore({
      data: t.getHackathonData().events.rows
    });
    resourceStore = new ResourceStore({
      data: t.getHackathonData().resources.rows
    });
    calendar = await getCalendar({
      date: new Date(2019, 9, 14),
      sidebar: false,
      eventStore,
      resourceStore,
      features: {
        eventTooltip: false
      },
      mode: 'agenda'
    });
    let newEvent;
    t.chain( // Should use autoCreate's startHour
    {
      rightClick: '.b-grid-cell[data-date="2019-10-15"]',
      offset: ['75%', '50%']
    }, {
      click: '.b-menuitem[data-ref="addEvent"]'
    }, {
      waitFor: () => {
        var _calendar$features$ev4;

        return (_calendar$features$ev4 = calendar.features.eventEdit.editor) === null || _calendar$features$ev4 === void 0 ? void 0 : _calendar$features$ev4.containsFocus;
      }
    }, {
      type: 'Added event[ENTER]'
    }, next => {
      newEvent = eventStore.last;
      t.is(newEvent.name, 'Added event');
      t.is(newEvent.startDate, new Date(2019, 9, 15, calendar.activeView.autoCreate.startHour));
      next();
    }, {
      rightClick: '.b-grid-cell[data-date="2019-10-15"]',
      offset: ['75%', '50%']
    }, {
      click: '.b-menuitem[data-ref="extra"]'
    }, next => {
      t.is(extraCount, 1);
      next();
    }, {
      rightClick: '.b-cal-event-wrap:contains(Added event)'
    }, {
      click: '.b-menuitem[data-ref="deleteEvent"]'
    }, next => {
      // Event has gone
      t.notOk(eventStore.includes(newEvent));
      next();
    }, {
      rightClick: '.b-cal-event-wrap:contains(Relax and official arrival beer)'
    }, {
      click: '.b-menuitem[data-ref="duplicate"]'
    }, () => {
      // One event duplicated
      t.is(duplicates.length, 1);
    });
  });
  t.it('Removing items', async t => {
    eventStore = new EventStore({
      data: t.getHackathonData().events.rows
    });
    resourceStore = new ResourceStore({
      data: t.getHackathonData().resources.rows
    });
    calendar = await getCalendar({
      date: new Date(2019, 9, 14),
      sidebar: false,
      eventStore,
      resourceStore,
      features: {
        eventTooltip: false,
        scheduleMenu: {
          items: {
            addEvent: null
          }
        },
        eventMenu: {
          items: {
            editEvent: null,
            deleteEvent: null
          }
        }
      },
      mode: 'day'
    });
    t.chain({
      rightClick: '.b-dayview-day-detail.b-calendar-cell'
    }, next => {
      // The addEvent item must not be there
      t.selectorCountIs('.b-menuitem:not(.b-hidden)', 1);
      t.selectorExists('.b-menuitem:contains(Extra function)');
      next();
    }, {
      rightClick: '.b-dayview-day-detail.b-calendar-cell .b-cal-event-wrap'
    }, () => {
      // The editEvent and deleteEvent items must not be there
      t.selectorCountIs('.b-menuitem:not(.b-hidden)', 1);
      t.selectorExists('.b-menuitem:contains(Duplicate)');
    });
  });
});