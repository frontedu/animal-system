"use strict";

StartTest(t => {
  let calendar, eventStore, resourceStore, harness, agenda, year, month, week, day;

  async function getCalendar(config) {
    const calendar = await t.getCalendar(config);
    eventStore = calendar.eventStore;
    resourceStore = calendar.resourceStore; // eslint-disable-next-line no-unused-vars

    ({
      agenda,
      year,
      month,
      week,
      day
    } = calendar.modes);
    return calendar;
  }

  t.beforeEach(function () {
    var _harness, _calendar;

    // Set doc styling to default values
    document.body.style.paddingTop = 0;
    document.scrollingElement.scrollTop = 0;

    if (calendar && !calendar.isDestroyed) {
      const eventEls = calendar.element.querySelectorAll('.b-calendar-cell.b-dayview-day-detail .b-cal-event-wrap'); // Check that no events ever get placed outside the visible bounds
      // https://github.com/bryntum/support/issues/3585

      for (let i = 0, {
        length
      } = eventEls; i < length; i++) {
        if (parseFloat(eventEls[i].style.top) > 100) {
          t.fail(`Event ${eventEls[i].dataset.eventId} element is rendered out of bounds`);
        }
      }
    }

    harness = (_harness = harness) === null || _harness === void 0 ? void 0 : _harness.destroy();
    (_calendar = calendar) === null || _calendar === void 0 ? void 0 : _calendar.destroy(); // Check that none of the floating things are persisting

    if (t.query('.b-overflowpopup,.b-sch-event-tooltip.b-eventeditor').length > 0) {
      t.selectorNotExists('.b-overflowpopup:visible');
      t.selectorNotExists('.b-sch-event-tooltip');
      t.selectorNotExists('.b-eventeditor');
    }
  });
  t.it('Calendar date range change events', async t => {
    const loadDateRangeEvents = [];
    calendar = await getCalendar({
      sidebar: false,
      mode: 'day',
      data: [],
      date: new Date(2019, 9, 13),
      listeners: {
        dateRangeChange(e) {
          loadDateRangeEvents.push(e);
        }

      }
    });
    t.chain(async () => t.is(calendar.mode, 'day'), next => {
      // DayView
      t.isDeeply(loadDateRangeEvents[0].old, {});
      t.isDeeply(loadDateRangeEvents[0].new, {
        startDate: new Date(2019, 9, 13),
        endDate: new Date(2019, 9, 14)
      });
      next();
    }, {
      click: 'button:contains(Week)'
    }, {
      waitFor: () => loadDateRangeEvents.length === 2
    }, async () => t.is(calendar.mode, 'week'), next => {
      // WeekView
      t.isDeeply(loadDateRangeEvents[1].old, {
        startDate: new Date(2019, 9, 13),
        endDate: new Date(2019, 9, 14)
      });
      t.isDeeply(loadDateRangeEvents[1].new, {
        startDate: new Date(2019, 9, 13),
        endDate: new Date(2019, 9, 20)
      });
      next();
    }, {
      click: 'button:contains(Month)'
    }, async () => t.is(calendar.mode, 'month'), next => {
      // MonthView
      t.isDeeply(loadDateRangeEvents[2].old, {
        startDate: new Date(2019, 9, 13),
        endDate: new Date(2019, 9, 20)
      });
      t.isDeeply(loadDateRangeEvents[2].new, {
        startDate: new Date(2019, 8, 29),
        endDate: new Date(2019, 10, 10)
      });
      next();
    }, {
      click: 'button:contains(Year)'
    }, async () => t.is(calendar.mode, 'year'), next => {
      // YearView
      t.isDeeply(loadDateRangeEvents[3].old, {
        startDate: new Date(2019, 8, 29),
        endDate: new Date(2019, 10, 10)
      });
      t.isDeeply(loadDateRangeEvents[3].new, {
        startDate: new Date(2018, 11, 30),
        endDate: new Date(2020, 0, 12)
      });
      next();
    }, {
      click: 'button:contains(Day)'
    }, async () => t.is(calendar.mode, 'day'), {
      click: 'button[data-ref="prevButton"]'
    }, next => {
      t.isDeeply(loadDateRangeEvents[4].old, {
        startDate: new Date(2018, 11, 30),
        endDate: new Date(2020, 0, 12)
      });
      t.isDeeply(loadDateRangeEvents[4].new, {
        startDate: new Date(2019, 9, 12),
        endDate: new Date(2019, 9, 13)
      });
      next();
    }, {
      click: 'button[data-ref="nextButton"]'
    }, next => {
      t.isDeeply(loadDateRangeEvents[5].old, {
        startDate: new Date(2019, 9, 12),
        endDate: new Date(2019, 9, 13)
      });
      t.isDeeply(loadDateRangeEvents[5].new, {
        startDate: new Date(2019, 9, 13),
        endDate: new Date(2019, 9, 14)
      });
      next();
    }, {
      click: 'button:contains(Week)'
    }, async () => t.is(calendar.mode, 'week'), {
      click: 'button[data-ref="prevButton"]'
    }, next => {
      t.isDeeply(loadDateRangeEvents[6].old, {
        startDate: new Date(2019, 9, 13),
        endDate: new Date(2019, 9, 14)
      });
      t.isDeeply(loadDateRangeEvents[6].new, {
        startDate: new Date(2019, 9, 6),
        endDate: new Date(2019, 9, 13)
      });
      next();
    }, {
      click: 'button[data-ref="nextButton"]'
    }, next => {
      t.isDeeply(loadDateRangeEvents[7].old, {
        startDate: new Date(2019, 9, 6),
        endDate: new Date(2019, 9, 13)
      });
      t.isDeeply(loadDateRangeEvents[7].new, {
        startDate: new Date(2019, 9, 13),
        endDate: new Date(2019, 9, 20)
      });
      next();
    }, {
      click: 'button:contains(Month)'
    }, async () => t.is(calendar.mode, 'month'), {
      click: 'button[data-ref="prevButton"]'
    }, next => {
      t.isDeeply(loadDateRangeEvents[8].old, {
        startDate: new Date(2019, 9, 13),
        endDate: new Date(2019, 9, 20)
      });
      t.isDeeply(loadDateRangeEvents[8].new, {
        startDate: new Date(2019, 8, 1),
        endDate: new Date(2019, 9, 13)
      });
      next();
    }, {
      click: 'button[data-ref="nextButton"]'
    }, next => {
      t.isDeeply(loadDateRangeEvents[9].old, {
        startDate: new Date(2019, 8, 1),
        endDate: new Date(2019, 9, 13)
      });
      t.isDeeply(loadDateRangeEvents[9].new, {
        startDate: new Date(2019, 8, 29),
        endDate: new Date(2019, 10, 10)
      });
      next();
    }, {
      click: 'button:contains(Year)'
    }, async () => t.is(calendar.mode, 'year'), {
      click: 'button[data-ref="prevButton"]'
    }, next => {
      t.isDeeply(loadDateRangeEvents[10].old, {
        startDate: new Date(2019, 8, 29),
        endDate: new Date(2019, 10, 10)
      });
      t.isDeeply(loadDateRangeEvents[10].new, {
        startDate: new Date(2017, 11, 31),
        endDate: new Date(2019, 0, 6)
      });
      next();
    }, {
      click: 'button[data-ref="nextButton"]'
    }, () => {
      // Exactly the expected number of data requests
      t.is(loadDateRangeEvents.length, 12);
      t.isDeeply(loadDateRangeEvents[11].old, {
        startDate: new Date(2017, 11, 31),
        endDate: new Date(2019, 0, 6)
      });
      t.isDeeply(loadDateRangeEvents[11].new, {
        startDate: new Date(2018, 11, 30),
        endDate: new Date(2020, 0, 12)
      });
    });
  });
  t.it('Inline loading on Calendar date range change events', async t => {
    const data = t.getHackathonData(),
          events = data.events.rows;
    eventStore = new EventStore({
      data: []
    });
    resourceStore = new ResourceStore({
      data: data.resources.rows
    });
    let dateRangeChangeCount = 0;
    calendar = await getCalendar({
      sidebar: false,
      mode: 'month',
      data: [],
      date: new Date(2019, 9, 13),
      modes: {
        resource: true
      },
      listeners: {
        dateRangeChange({
          source: calendar,
          new: {
            startDate: newStartDate,
            endDate: newEndDate
          }
        }) {
          dateRangeChangeCount++;
          const loadedEvents = events.filter(e => {
            // So we have a parsed date to test
            e = eventStore.createRecord(e);
            return DateHelper.intersectSpans(e.startDate, e.endDate, newStartDate, newEndDate);
          });
          calendar.project.loadInlineData({
            eventsData: loadedEvents,
            resourcesData: data.resources.rows
          });
        }

      }
    }); // The initial refresh must have requested its date range

    t.is(dateRangeChangeCount, 1);
    t.is(eventStore.count, 27);
    eventStore.forEach(e => {
      if (!DateHelper.intersectSpans(e.startDate, e.endDate, calendar.activeView.startDate, calendar.activeView.endDate)) {
        t.fail(`Event ${e.name}, ${DateHelper.format(e.startDate, 'YYYY-MM-DD')}-${DateHelper.format(e.endDate, 'YYYY-MM-DD')} found outside requested time range`);
      }
    }); // Switch to a week view

    await t.click('button[data-ref="weekShowButton"]');
    await t.waitForEvent(calendar, 'activeItemChange'); // The request for the week's range

    t.is(dateRangeChangeCount, 2);
    t.is(eventStore.count, 23);
    eventStore.forEach(e => {
      if (!DateHelper.intersectSpans(e.startDate, e.endDate, calendar.activeView.startDate, calendar.activeView.endDate)) {
        t.fail(`Event ${e.name}, ${DateHelper.format(e.startDate, 'YYYY-MM-DD')}-${DateHelper.format(e.endDate, 'YYYY-MM-DD')} found outside requested time range`);
      }
    }); // Switch to a single day view by clicking a day header

    await t.click('.b-cal-cell-header[data-header-date="2019-10-14"]');
    await t.waitForEvent(calendar, 'activeItemChange'); // The request for the day's range

    t.is(dateRangeChangeCount, 3);
    t.is(eventStore.count, 4);
    eventStore.forEach(e => {
      if (!DateHelper.intersectSpans(e.startDate, e.endDate, calendar.activeView.startDate, calendar.activeView.endDate)) {
        t.fail(`Event ${e.name}, ${DateHelper.format(e.startDate, 'YYYY-MM-DD')}-${DateHelper.format(e.endDate, 'YYYY-MM-DD')} found outside requested time range`);
      }
    }); // Back to the week

    await t.click('button[data-ref="weekShowButton"]');
    await t.waitForEvent(calendar, 'activeItemChange'); // The request for the week's range

    t.is(dateRangeChangeCount, 4);
    t.is(eventStore.count, 23);
    eventStore.forEach(e => {
      if (!DateHelper.intersectSpans(e.startDate, e.endDate, calendar.activeView.startDate, calendar.activeView.endDate)) {
        t.fail(`Event ${e.name}, ${DateHelper.format(e.startDate, 'YYYY-MM-DD')}-${DateHelper.format(e.endDate, 'YYYY-MM-DD')} found outside requested time range`);
      }
    }); // After this, when we switch to the day, it must load events for the 15th

    calendar.date = '2019-10-15'; // Back to the day

    await t.click('button[data-ref="dayShowButton"]');
    await t.waitForEvent(calendar, 'activeItemChange'); // The request for the 15th

    t.is(dateRangeChangeCount, 5);
    t.is(eventStore.count, 7);
    eventStore.forEach(e => {
      if (!DateHelper.intersectSpans(e.startDate, e.endDate, calendar.activeView.startDate, calendar.activeView.endDate)) {
        t.fail(`Event ${e.name}, ${DateHelper.format(e.startDate, 'YYYY-MM-DD')}-${DateHelper.format(e.endDate, 'YYYY-MM-DD')} found outside requested time range`);
      }
    }); // To the resource view. It's a week view by default

    await t.click('[data-ref="resourceShowButton"]');
    await t.waitForEvent(calendar, 'activeItemChange');
    t.is(calendar.activeView.startDate, new Date(2019, 9, 13));
    t.is(calendar.activeView.endDate, new Date(2019, 9, 20)); // The request for the week Sun 13th to Sat 19th inclusive

    t.is(dateRangeChangeCount, 6);
    t.is(eventStore.count, 23);
    eventStore.forEach(e => {
      if (!DateHelper.intersectSpans(e.startDate, e.endDate, calendar.activeView.startDate, calendar.activeView.endDate)) {
        t.fail(`Event ${e.name}, ${DateHelper.format(e.startDate, 'YYYY-MM-DD')}-${DateHelper.format(e.endDate, 'YYYY-MM-DD')} found outside requested time range`);
      }
    });
  });
  t.it('hiding the active date should move the active date to a visible date', async t => {
    eventStore = new EventStore({
      data: t.getHackathonData().events.rows
    });
    resourceStore = new ResourceStore({
      data: t.getHackathonData().resources.rows
    });
    calendar = await getCalendar({
      // This is a Sunday
      date: new Date(2019, 9, 13),
      eventStore,
      resourceStore,
      modes: {
        day: null,
        month: null,
        year: null,
        agenda: null
      }
    });
    calendar.activeView.hideNonWorkingDays = true; // Because the 13th is now a hidden date.

    t.is(calendar.date, new Date(2019, 9, 14), 'Active date is now Monday 14th');
    calendar.activeView.hideNonWorkingDays = false;
    t.is(calendar.date, new Date(2019, 9, 14), 'No change');
    calendar.date = new Date(2019, 9, 19);
    t.is(calendar.date, new Date(2019, 9, 19), 'Active date is now Saturday 19th');
    calendar.activeView.hideNonWorkingDays = true; // Because the 19th is now a hidden date.

    t.is(calendar.date, new Date(2019, 9, 18), 'Active date is now Saturday 18th');
  });
  t.it('Drag-create and drag-resize into a different zone should not throw errors', async t => {
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
    calendar = await getCalendar({
      date: new Date(2019, 9, 14),
      eventStore,
      resourceStore,
      modes: {
        day: null,
        month: null,
        year: null,
        agenda: null
      }
    });
    await t.dragTo('.b-dayview-day-detail.b-calendar-cell[data-date="2019-10-15"]', '.b-dayview-allday.b-calendar-cell[data-date="2019-10-15"]', null, null, null, true, ['50%', 20], ['50%', '100%-10']);
    await t.mouseUp(null);
    await t.dragTo('.b-dayview-day-detail.b-calendar-cell[data-date="2019-10-16"] .b-cal-event-wrap', '.b-dayview-allday.b-calendar-cell[data-date="2019-10-16"]', null, null, null, true, ['50%', 5], ['50%', '100%-10']);
    t.pass('Drag out of week view worked with no errors');
  });
  t.it('Should be able to modify an occurrence maintaining the original COUNT', async t => {
    harness = t.setupWeekViewDragHarness();
    await harness.init(t, {
      // This is a Sunday
      date: new Date(2019, 9, 13),
      events: [],
      features: {
        eventEdit: true
      },
      modes: {
        day: null,
        month: null,
        year: null,
        agenda: null
      }
    });
    calendar = harness.calendar; // Drag-create a recurring event that spans three days

    await harness.dayTimeDrag({
      keys: '^',
      from: {
        date: '2019-10-16',
        time: '2:00'
      },
      to: {
        date: '2019-10-18',
        time: '5:00'
      }
    });
    await t.waitFor(() => {
      var _calendar$features$ev;

      return (_calendar$features$ev = calendar.features.eventEdit.editor) === null || _calendar$features$ev === void 0 ? void 0 : _calendar$features$ev.containsFocus;
    });
    await t.type(null, 'Three of these'); // Edit to ensure that the count is 3

    await t.click('button[data-ref="editRecurrenceButton"]');
    await t.click('[data-ref="stopRecurrenceField"] [data-ref="expand"]');
    await t.click('.b-list-item:contains(After)');
    await t.type('[data-ref="countField"] input', 3, null, null, null, true);
    await t.click('.b-recurrenceeditor button[data-ref="saveButton"]'); // Save the new recurring event

    await t.click('.b-eventeditor button[data-ref="saveButton"]'); // TODO: Remove this when https://github.com/bryntum/bryntum-suite/issues/1672 is fixed

    await t.click('.b-sch-recurrenceconfirmation [data-ref="changeMultipleButton"]'); // There should be three

    t.selectorCountIs('.b-cal-event-wrap', 3, 'Three events in total');
    t.isStrict(harness.newEventRecord.allDay, false, 'Correct allDay');
    t.is(harness.newEventRecord.startDate, new Date(2019, 9, 16, 2), 'Correct startDate');
    t.is(harness.newEventRecord.endDate, new Date(2019, 9, 16, 5), 'Correct endDate');
    t.is(harness.occurrences.length, 3, 'Correct number of occurrences');
    t.is(harness.newEventRecord.recurrence.count, 3, 'Correct recurrence count');
    t.is(harness.newEventRecord.recurrence.frequency, 'DAILY', 'Correct recurrence frequency');
    t.is(harness.newEventRecord.recurrence.interval, 1, 'Correct recurrence interval'); // There will be 2 occurrences. Modify the first one.

    const eventRecord = harness.newEventRecord.occurrences[0];
    const [el, offset] = await harness.hoverBottom(eventRecord.id);
    t.is(harness.isHovering(el), 'bottom-edge', 'Hovering should be active');
    await harness.drag(el, {
      offset,
      by: [0, 2 * harness.DAY_PX_PER_HOUR + harness.EDGE_OFFSET]
    });
    await harness.drop();
    await t.click('button[data-ref="changeMultipleButton"]');
    t.is(harness.newEventRecord.occurrences.length, 0, 'No occurrences of the original');
    t.is(eventRecord.recurrence.count, 2, 'The new base occurs twice');
    t.is(eventRecord.occurrences.length, 1, 'The new base has 1 occurrence');
    t.selectorCountIs('.b-cal-event-wrap', 3, 'Still three events in total');
  }); // https://github.com/bryntum/support/issues/2149

  t.it('Should filter multi assigned task', async t => {
    calendar = await getCalendar({
      date: new Date(2019, 9, 14),
      project: {
        eventsData: [{
          id: 1,
          name: 'Event 1',
          duration: 1,
          durationUnit: 'hour',
          startDate: new Date(2019, 9, 15, 9)
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
    });
    await t.waitForProjectReady(calendar);
    t.chain({
      waitForSelector: '.b-resourcefilter'
    }, {
      click: '.b-list-item[data-id="r1"]'
    }, {
      waitForSelector: '.b-cal-event-wrap[data-event-id="1"]',
      desc: 'Event 1 visible after filter for Resource 2'
    }, {
      click: '.b-list-item[data-id="r1"]'
    }, {
      click: '.b-list-item[data-id="r2"]'
    }, {
      waitForSelector: '.b-cal-event-wrap[data-event-id="1"]',
      desc: 'Event 1 visible after filter for Resource 1'
    }, {
      click: '.b-list-item[data-id="r1"]'
    }, {
      waitForSelectorNotFound: '.b-cal-event-wrap[data-event-id="1"]',
      desc: 'Event 1 is not visible after uncheck Resource 1 and Resource 2'
    });
  });
  t.it('With EventList', async t => {
    calendar = await getCalendar({
      date: new Date(2019, 9, 14),
      project: {
        eventsData: [{
          id: 1,
          name: 'Event 1',
          duration: 1,
          durationUnit: 'hour',
          startDate: new Date(2019, 9, 15, 9)
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
      },
      modes: {
        day: null,
        week: null,
        month: null,
        year: null,
        agenda: null,
        list: true
      }
    });
    const list = calendar.activeView,
          event = calendar.eventStore.first,
          {
      cellEdit
    } = list.features;
    await t.waitForProjectReady(calendar);
    t.notOk(list.store.sorters.length, 'List not sorted'); // Click header to sort

    await t.click('.b-grid-header[data-column="name"]');
    t.is(list.store.sorters.length, 1, 'List sorted'); // Start editing the name

    await t.doubleClick('.b-grid-cell[data-column="name"]');
    await t.waitFor(() => cellEdit.editor.containsFocus);
    await t.type(cellEdit.editorContext.editor.inputField.input, 'New name'); // Click into editing next column

    await t.click('.b-grid-cell[data-column="startDate"]'); // Cell editing must have moved on.

    await t.waitFor(() => cellEdit.editor.containsFocus && cellEdit.editorContext.column.text === 'Start'); // Edit of name was finished.

    t.is(event.name, 'New name');
    const v = cellEdit.editor.inputField.dateField.input.value;
    await t.type(cellEdit.editor.inputField.dateField.input, 'a', null, null, null, true);
    t.is(cellEdit.editor.inputField.dateField.input.value, 'a');
    await t.type(cellEdit.editor.inputField.dateField.input, '[ESCAPE]');
    t.ok(cellEdit.editor.containsFocus, 'Editor still focused');
    t.is(cellEdit.editor.inputField.dateField.input.value, v, 'Value reverted');
    await t.type(cellEdit.editor.inputField.dateField.input, '[ESCAPE]'); // Kick off an async engine recalculation then destroy.
    // When the engine's timeout fires, the destroyed grid and its features must not react.
    // See override of destroy in EventList. The features must be destroyed along with the grid.

    calendar.eventStore.first.startDate = new Date(2019, 9, 20, 9);
    calendar.destroy();
  }); // https://github.com/bryntum/support/issues/3585

  t.it('Events which start before the dayStartTime should be rendered at -ve %age top.', async t => {
    calendar = await getCalendar({
      height: 500,
      width: 700,
      modes: {
        week: {
          dayStartTime: 7,
          dayEndTime: 18
        }
      },
      date: '2019-10-15',
      eventStore: {
        data: [{
          name: 'Meeting',
          resourceId: 'bryntum',
          startDate: '2019-10-15T12:00:00',
          endDate: '2019-10-15T15:00:00'
        }]
      }
    });
    const weekView = calendar.activeView,
          eventRecord = calendar.eventStore.first,
          eventEl = weekView.getEventElement(eventRecord);
    t.notOk(eventRecord.isInterDay, 'Event does not flag up as interDay'); // Wait for layout to be correct

    await t.waitForAnimationFrame();
    await t.doubleClick('.b-cal-event-wrap:contains(Meeting)');
    await t.click('[data-ref="startTimeField"] input');
    await t.type(document.activeElement, '06:00', null, null, null, true);
    await t.click('button[data-ref="saveButton"]');
    await t.waitForAnimationFrame(); // The event starts one hour above the day start, but the
    // layout Math.maxes it with 0, and adds a class to specify that it starts above.

    t.is(eventEl.style.top, '0%');
    t.hasCls(eventEl, 'b-starts-above'); // This must never scroll. That was part of the bug. Focusing caused this element to scroll.
    // It's now overflow:clip

    t.is(weekView.horizontalScroller.element.scrollTop, 0);
  }); // https://github.com/bryntum/support/issues/3057
  // This must not throw an error.

  t.it('Event remove after AgendaView activation', async t => {
    eventStore = new EventStore({
      data: []
    });
    resourceStore = new ResourceStore({
      data: t.getHackathonData().resources.rows
    });
    calendar = await getCalendar({
      date: new Date(2019, 9, 14),
      eventStore,
      resourceStore,
      mode: 'agenda'
    });
    await t.click('[data-ref="monthShowButton"]');
    await t.doubleClick('.b-monthview .b-cal-event-bar-container');
    await t.waitFor(() => {
      var _calendar$features$ev2;

      return (_calendar$features$ev2 = calendar.features.eventEdit.editor) === null || _calendar$features$ev2 === void 0 ? void 0 : _calendar$features$ev2.containsFocus;
    });
    await t.click('.b-monthview  .b-cal-event-wrap');
    t.pass('Test passed');
  });
  t.it('fitHours in DayView', async t => {
    const date = new Date(2019, 9, 15, 9);
    eventStore = new EventStore({
      data: ArrayHelper.populate(45, i => {
        const id = String(i + 1);
        return {
          duration: 1,
          durationUnit: 'day',
          id,
          name: `Event ${id}`,
          resourceId: 'r1',
          startDate: date,
          allDay: true
        };
      })
    });
    resourceStore = new ResourceStore({
      data: [{
        id: 'r1',
        name: 'Resource 1'
      }, {
        id: 'r2',
        name: 'Resource 2'
      }]
    });
    calendar = await getCalendar({
      date: new Date(2019, 9, 14),
      eventStore,
      resourceStore,
      modes: {
        week: {
          fitHours: {
            // We want it to shrink so we can check it using dayView.scrollable.clientHeight / 24
            minHeight: 1
          }
        },
        day: false,
        month: false,
        year: false,
        agenda: false
      }
    });
    const {
      scrollBarWidth
    } = DomHelper,
          dayView = calendar.activeView,
          {
      allDayEvents,
      dayContainerElement
    } = dayView,
          {
      bodyElement,
      cellContainer
    } = allDayEvents;
    await t.waitForProjectReady(calendar.modes.month); // All day events changes height using animation

    await t.waitForAnimations(); // The day section must adjust itself to not overflow

    await t.waitFor(() => dayView.scrollable.scrollHeight <= dayView.scrollable.clientHeight);
    const initialDayViewHourHeight = dayView.hourHeight; // No overflow with fitHours - hidden where scrollbars are visible, doesn't matter where not.

    t.is(bodyElement.style.overflowY, scrollBarWidth ? 'hidden' : 'auto'); // Widths must be synced.

    t.isApprox(Rectangle.client(dayContainerElement).width, Rectangle.client(cellContainer).width); // Expand the all day events to show all the all day events.
    // This should result in there being events overflowing

    await t.click(dayView.cornerElement);
    await dayView.heightAnimation; // We must never acquire scroll in the day section

    await t.waitFor(() => dayView.scrollable.scrollHeight <= dayView.scrollable.clientHeight); // Hours must get smaller

    await t.waitFor(() => dayView.hourHeight < initialDayViewHourHeight); // Scrollable overflow in expanded mode because all day row now has overflow.

    await t.waitFor(() => bodyElement.style.overflowY === 'auto'); // Widths must still be synced.

    t.isApprox(Rectangle.client(dayContainerElement).width, Rectangle.client(cellContainer).width); // Collapse the all day events so that there's a [+n more] pill to show overflowing events

    await t.click(dayView.cornerElement);
    await dayView.heightAnimation; // Hour height grows back again after all day row is collapsed.

    await t.waitFor(() => Math.abs(dayView.hourHeight - initialDayViewHourHeight) < 1); // No overflow with fitHours - hidden where scrollbars are visible, doesn't matter where not.

    await t.waitFor(() => bodyElement.style.overflowY === scrollBarWidth ? 'hidden' : 'auto'); // We must never acquire scroll in the day section

    t.isLessOrEqual(dayView.scrollable.scrollHeight, dayView.scrollable.clientHeight); // Widths must still be synced.

    t.isApprox(Rectangle.client(dayContainerElement).width, Rectangle.client(cellContainer).width);
    calendar.height = 500;
    await t.click('button.b-cal-cell-overflow');
    const {
      overflowPopup
    } = allDayEvents; // Overflow must be within available space inside the constrainPadding margins.

    t.samePx(overflowPopup.height, calendar.height - overflowPopup.align.constrainPadding * 2);
    t.samePx(overflowPopup.y, overflowPopup.align.constrainPadding); // Resizing must also fix the hour height

    t.is(dayView.hourHeight, dayView.scrollable.clientHeight / 24);
  });
  t.it('fitHours in DayView with minimum hour height', async t => {
    const date = new Date(2019, 9, 15, 9),
          {
      scrollBarWidth
    } = DomHelper;
    eventStore = new EventStore({
      data: ArrayHelper.populate(45, i => {
        const id = String(i + 1);
        return {
          duration: 1,
          durationUnit: 'day',
          id,
          name: `Event ${id}`,
          resourceId: 'r1',
          startDate: date,
          allDay: true
        };
      })
    });
    resourceStore = new ResourceStore({
      data: [{
        id: 'r1',
        name: 'Resource 1'
      }, {
        id: 'r2',
        name: 'Resource 2'
      }]
    });
    calendar = await getCalendar({
      date: new Date(2019, 9, 14),
      eventStore,
      resourceStore,
      modes: {
        week: {
          fitHours: {
            minHeight: 20
          }
        },
        day: false,
        month: false,
        year: false,
        agenda: false
      }
    });
    const dayView = calendar.activeView,
          {
      allDayEvents,
      dayContainerElement
    } = dayView,
          {
      bodyElement,
      cellContainer
    } = allDayEvents;
    await t.waitForProjectReady(calendar.modes.month); // All day events changes height using animation

    await t.waitForAnimations(); // The day section must adjust itself to not overflow

    await t.waitFor(() => dayView.scrollable.scrollHeight <= dayView.scrollable.clientHeight); // No overflow with fitHours - hidden where scrollbars are visible, doesn't matter where not.

    t.is(bodyElement.style.overflowY, scrollBarWidth ? 'hidden' : 'auto'); // Widths must be synced.

    t.isApprox(Rectangle.client(dayContainerElement).width, Rectangle.client(cellContainer).width);
    calendar.height = 500; // Resizing must not go below 20, even though fit height would be about 11

    t.is(dayView.hourHeight, 20); // Widths must be synced.

    t.isApprox(Rectangle.client(dayContainerElement).width, Rectangle.client(cellContainer).width);
  });
  t.it('WeekView should be able to work without an all day row', async t => {
    eventStore = new EventStore({
      data: t.getHackathonData().events.rows
    });
    resourceStore = new ResourceStore({
      data: t.getHackathonData().resources.rows
    });
    calendar = await getCalendar({
      date: new Date(2019, 9, 14),
      eventStore,
      resourceStore,
      modes: {
        week: {
          allDayEvents: null,
          dayStartShift: 9
        },
        day: null,
        month: null,
        year: null,
        agenda: null
      }
    });
    const dayView = calendar.activeView,
          {
      allDayEvents
    } = dayView;
    await t.waitForProjectReady(calendar.modes.week);
    t.notOk(allDayEvents); // Must not throw on allDayEvents being null

    dayView.dayStartShift = 7; // Must not throw on allDayEvents being null

    dayView.hourHeight = 20; // Must not throw on allDayEvents being null

    calendar.height = 500;
  });
  t.it('WeekView should be able to be forced to be empty', async t => {
    eventStore = new EventStore({
      data: t.getHackathonData().events.rows
    });
    resourceStore = new ResourceStore({
      data: t.getHackathonData().resources.rows
    });
    calendar = await getCalendar({
      date: new Date(2019, 9, 14),
      eventStore,
      resourceStore,
      modes: {
        week: {
          allDayEvents: {
            eventFilter: () => false
          },
          dayStartShift: 9
        },
        day: null,
        month: null,
        year: null,
        agenda: null
      }
    });
    const dayView = calendar.activeView,
          {
      allDayEvents
    } = dayView;
    await t.waitForProjectReady(calendar.modes.week);
    t.ok(allDayEvents); // No events, and no event height

    t.is(Math.max(0, ...[...allDayEvents._cellMap.values()].map(c => c.events.length)), 0);
    t.is(allDayEvents.eventContainerHeight, 0); // Must not throw on allDayEvents being null

    dayView.dayStartShift = 7; // Must not throw on allDayEvents being null

    dayView.hourHeight = 20; // Must not throw on allDayEvents being null

    calendar.height = 500;
  });
  t.it('should not change date when clicking inside an overflow popup for an "other month" date', async t => {
    eventStore = new EventStore({
      data: [{
        startDate: '2020-11-05',
        endDate: '2020-11-06',
        name: 'Event 1'
      }, {
        startDate: '2020-11-05',
        endDate: '2020-11-06',
        name: 'Event 2'
      }, {
        startDate: '2020-11-05',
        endDate: '2020-11-06',
        name: 'Event 3'
      }, {
        startDate: '2020-11-05',
        endDate: '2020-11-06',
        name: 'Event 4'
      }, {
        startDate: '2020-11-05',
        endDate: '2020-11-06',
        name: 'Event 5'
      }, {
        startDate: '2020-11-05',
        endDate: '2020-11-06',
        name: 'Event 6'
      }, {
        startDate: '2020-11-05',
        endDate: '2020-11-06',
        name: 'Event 7'
      }, {
        startDate: '2020-11-05',
        endDate: '2020-11-06',
        name: 'Event 8'
      }, {
        startDate: '2020-11-05',
        endDate: '2020-11-06',
        name: 'Event 9'
      }, {
        startDate: '2020-11-05',
        endDate: '2020-11-06',
        name: 'Event 10'
      }]
    });
    resourceStore = new ResourceStore({
      data: []
    });
    const calDate = new Date(2020, 9, 1);
    calendar = await getCalendar({
      date: calDate,
      eventStore,
      resourceStore,
      modes: {
        day: false,
        week: false,
        agenda: false
      }
    });
    await t.click('.b-cal-cell-overflow');
    await t.waitFor(() => calendar.activeView.overflowPopup.containsFocus); // Should not navigate to the cell's month even though it's in next month
    // because the user is interacting with the cell and the UI is anchored there.

    t.is(calendar.date, calDate);
    await t.click('.b-cal-event-wrap:contains(Event 10)');
    await t.waitFor(() => calendar.features.eventTooltip.tooltip.isVisible); // Should not navigate to the cell's month even though it's in next month
    // because the user is interacting with the cell and the UI is anchored there.

    t.is(calendar.date, calDate);
    await t.click(calendar.features.eventTooltip.tooltip.tools.edit.element); // Should not navigate to the cell's month even though it's in next month
    // because the user is interacting with the cell and the UI is anchored there.

    t.is(calendar.date, calDate);
    await t.waitFor(() => calendar.features.eventEdit.editor.containsFocus); // Should not navigate to the cell's month even though it's in next month
    // because the user is interacting with the cell and the UI is anchored there.

    t.is(calendar.date, calDate);
    await t.click(calendar.features.eventEdit.editor.tools.close.element);
    await t.waitFor(() => calendar.activeView.overflowPopup.containsFocus);
    t.is(calendar.date, calDate);
    await t.click(calendar.activeView.overflowPopup.headerElement); // That must change the date

    t.is(calendar.date, new Date(2020, 10, 5));
  });
  t.it('should not change date when clicking on an event bar in an "other month" date', async t => {
    eventStore = new EventStore({
      data: [{
        startDate: '2020-11-05',
        endDate: '2020-11-06',
        name: 'Event 1'
      }]
    });
    resourceStore = new ResourceStore({
      data: []
    });
    const calDate = new Date(2020, 9, 1);
    calendar = await getCalendar({
      date: calDate,
      eventStore,
      resourceStore,
      modes: {
        day: false,
        week: false,
        agenda: false
      }
    });
    await t.click('.b-cal-event-wrap:contains(Event 1)');
    await t.waitFor(() => calendar.features.eventTooltip.tooltip.isVisible); // Should not navigate to the cell's month even though it's in next month
    // because the user is interacting with the event bar and the UI is anchored there.

    t.is(calendar.date, calDate);
  });
  t.it('should navigate to the day view on click of the overflow popup header', async t => {
    eventStore = new EventStore({
      data: [{
        startDate: '2020-11-05',
        endDate: '2020-11-06',
        name: 'Event 1'
      }, {
        startDate: '2020-11-05',
        endDate: '2020-11-06',
        name: 'Event 2'
      }, {
        startDate: '2020-11-05',
        endDate: '2020-11-06',
        name: 'Event 3'
      }, {
        startDate: '2020-11-05',
        endDate: '2020-11-06',
        name: 'Event 4'
      }, {
        startDate: '2020-11-05',
        endDate: '2020-11-06',
        name: 'Event 5'
      }, {
        startDate: '2020-11-05',
        endDate: '2020-11-06',
        name: 'Event 6'
      }, {
        startDate: '2020-11-05',
        endDate: '2020-11-06',
        name: 'Event 7'
      }, {
        startDate: '2020-11-05',
        endDate: '2020-11-06',
        name: 'Event 8'
      }, {
        startDate: '2020-11-05',
        endDate: '2020-11-06',
        name: 'Event 9'
      }, {
        startDate: '2020-11-05',
        endDate: '2020-11-06',
        name: 'Event 10'
      }]
    });
    resourceStore = new ResourceStore({
      data: []
    });
    calendar = await getCalendar({
      date: new Date(2020, 9, 1),
      eventStore,
      resourceStore,
      mode: 'month',
      modes: {
        week: false,
        agenda: false
      }
    });
    await t.click('.b-cal-cell-overflow'); // In contrast to the previous test, clicking the *header* should navigate away.

    await t.click(calendar.activeView.overflowPopup.headerElement); // Clicking the overflow popup header element should navigate to the day view for that date

    await t.waitFor(() => calendar.mode === 'day'); // That must change the date

    t.is(calendar.date, new Date(2020, 10, 5));
  });
  t.it('Should honour minDate and maxDate', async t => {
    eventStore = new EventStore({
      data: t.getHackathonData().events.rows
    });
    resourceStore = new ResourceStore({
      data: t.getHackathonData().resources.rows
    });
    calendar = await getCalendar({
      date: new Date(2019, 9, 14),
      eventStore,
      resourceStore,
      minDate: new Date(2018, 11, 30),
      maxDate: new Date(2020, 0, 12),
      mode: 'year'
    }); // test minDate

    t.is(calendar.activeView.year, 2019);
    await t.click('button[data-ref="prevButton"]');
    t.is(calendar.activeView.year, 2019);
    await t.click('.b-yearview-month-name:contains(January)');
    await t.waitForAnimations();
    await t.waitFor(() => calendar.activeView.month.month === 0);
    await t.click('button[data-ref="prevButton"]');
    t.is(calendar.activeView.month.month, 0);
    await t.click('.b-cal-cell-header .b-week-num:contains(1)');
    await t.waitForAnimations();
    await t.waitFor(() => ObjectHelper.isEqual(calendar.activeView.week, [2019, 1]));
    await t.click('button[data-ref="prevButton"]');
    t.isDeeply(calendar.activeView.week, [2019, 1]);
    await t.click('.b-cal-cell-header .b-day-name-date:contains(30)');
    await t.waitForAnimations();
    await t.waitFor(() => ObjectHelper.isEqual(calendar.activeView.date, new Date(2018, 11, 30)));
    await t.click('button[data-ref="prevButton"]');
    t.is(calendar.activeView.date, new Date(2018, 11, 30)); // Now for maxDate

    await t.click('button[data-ref="yearShowButton"]');
    await t.waitForAnimations();
    t.is(calendar.activeView.year, 2019);
    await t.click('button[data-ref="nextButton"]');
    t.is(calendar.activeView.year, 2019);
    await t.click('.b-yearview-month-name:contains(December)');
    await t.waitForAnimations();
    await t.waitFor(() => calendar.activeView.month.month === 11);
    await t.click('button[data-ref="nextButton"]');
    t.is(calendar.activeView.month.month, 11);
    await t.click('.b-calendar-cell[data-date="2020-01-05"] .b-week-num:contains(2)');
    await t.waitForAnimations();
    await t.waitFor(() => ObjectHelper.isEqual(calendar.activeView.week, [2020, 2]));
    await t.click('button[data-ref="nextButton"]');
    t.isDeeply(calendar.activeView.week, [2020, 2]);
    await t.click('.b-cal-cell-header .b-day-name-date:contains(11)');
    await t.waitForAnimations();
    await t.waitFor(() => ObjectHelper.isEqual(calendar.activeView.date, new Date(2020, 0, 11)));
    await t.click('button[data-ref="nextButton"]');
    t.is(calendar.activeView.date, new Date(2020, 0, 11));
  });
  t.it('beforeDateChange event', async t => {
    eventStore = new EventStore({
      data: t.getHackathonData().events.rows
    });
    resourceStore = new ResourceStore({
      data: t.getHackathonData().resources.rows
    });
    calendar = await getCalendar({
      date: new Date(2019, 9, 14),
      eventStore,
      resourceStore,
      mode: 'year',
      listeners: {
        beforeDateChange() {
          return false;
        }

      }
    });
    t.is(calendar.activeView.year, 2019);
    await t.click('button[data-ref="prevButton"]');
    t.is(calendar.activeView.year, 2019);
    await t.click('button[data-ref="nextButton"]');
    t.is(calendar.activeView.year, 2019);
    await t.click('.b-yearview-month-name:contains(January)');
    await t.waitForAnimations(); // Date was set to October 14th, so the month view is stuck in October

    await t.waitFor(() => calendar.activeView.month.month === 9);
    await t.click('button[data-ref="prevButton"]');
    t.is(calendar.activeView.month.month, 9);
    await t.click('button[data-ref="nextButton"]');
    t.is(calendar.activeView.month.month, 9);
    await t.click('.b-cal-cell-header .b-week-num:contains(45)');
    await t.waitForAnimations(); // Date is Oct 14th, so forced to week 42

    await t.waitFor(() => ObjectHelper.isEqual(calendar.activeView.week, [2019, 42]));
    await t.click('button[data-ref="prevButton"]');
    t.isDeeply(calendar.activeView.week, [2019, 42]);
    await t.click('button[data-ref="nextButton"]');
    t.isDeeply(calendar.activeView.week, [2019, 42]);
    await t.click('.b-cal-cell-header .b-day-name-date:contains(13)');
    await t.waitForAnimations(); // Date is locked to Oct 14th.

    await t.waitFor(() => ObjectHelper.isEqual(calendar.activeView.date, new Date(2019, 9, 14)));
    await t.click('button[data-ref="prevButton"]');
    t.is(calendar.activeView.date, new Date(2019, 9, 14));
    await t.click('button[data-ref="nextButton"]');
    t.is(calendar.activeView.date, new Date(2019, 9, 14));
  });
  t.it('Arrow navigation should not work in Calendar', async t => {
    eventStore = new EventStore({
      data: [{
        name: 'test',
        startDate: new Date(2021, 11, 30, 11),
        endDate: new Date(2021, 11, 30, 12)
      }]
    });
    resourceStore = new ResourceStore({
      data: []
    });
    calendar = await getCalendar({
      date: new Date(2021, 11, 30, 11),
      eventStore,
      resourceStore
    });
    const v = calendar.activeView;
    await t.click('.b-cal-event-wrap');
    await t.waitFor(() => document.activeElement === v.getEventElement(eventStore.first));
    await t.type(null, '[UP]');
    await t.type(null, '[DOWN]'); // No navigation must take place, no errors must be thrown

    t.is(document.activeElement, v.getEventElement(eventStore.first));
  });
  t.it('Sidebar datepicker override', async t => {
    calendar = await getCalendar({
      date: new Date(2021, 11, 30, 11),
      eventStore,
      resourceStore,
      // Date picker collapses into its header when collapsible is true
      datePicker: {
        title: 'Month Navigation',
        collapsible: true
      }
    }); // Our items setting must have been merged in

    t.selectorCountIs('.b-datepicker.b-panel-collapsible .b-header-title:contains(Month Navigation)', 1);
    t.selectorCountIs('.b-datepicker.b-panel-collapsible button.b-collapsetool', 1);
  });
  t.it('Sidebar items datepicker override', async t => {
    calendar = await getCalendar({
      date: new Date(2021, 11, 30, 11),
      eventStore,
      resourceStore,
      sidebar: {
        items: {
          // Date picker collapses into its header when collapsible is true
          datePicker: {
            title: 'Month Navigation',
            collapsible: true
          }
        }
      }
    }); // Our items setting must have been merged in

    t.selectorCountIs('.b-datepicker.b-panel-collapsible .b-header-title:contains(Month Navigation)', 1);
    t.selectorCountIs('.b-datepicker.b-panel-collapsible button.b-collapsetool', 1);
  });
  t.it('ResourceFilter should work after removing a resource', async t => {
    const data = t.getHackathonData();
    eventStore = new EventStore({
      data: data.events.rows
    });
    resourceStore = new ResourceStore({
      data: data.resources.rows
    });
    calendar = await getCalendar({
      date: new Date(2019, 9, 14),
      eventStore,
      resourceStore,
      modeDefaults: {
        eventRenderer({
          renderData,
          resourceRecord
        }) {
          renderData.dataset.resourceId = resourceRecord.id;
        }

      }
    });
    t.is(calendar.activeView.dayContentElement.querySelectorAll('.b-cal-event-wrap[data-resource-id="bryntum"]').length, 6);
    t.is(calendar.activeView.dayContentElement.querySelectorAll('.b-cal-event-wrap[data-resource-id="hotel"]').length, 14);
    t.is(calendar.activeView.dayContentElement.querySelectorAll('.b-cal-event-wrap[data-resource-id="mats"]').length, 3);
    eventStore.remove(eventStore.query(e => e.resourceId === 'mats'));
    await t.waitFor(() => calendar.activeView.dayContentElement.querySelectorAll('.b-cal-event-wrap[data-resource-id="mats"]').length === 0);
    t.is(calendar.activeView.dayContentElement.querySelectorAll('.b-cal-event-wrap[data-resource-id="bryntum"]').length, 6);
    t.is(calendar.activeView.dayContentElement.querySelectorAll('.b-cal-event-wrap[data-resource-id="hotel"]').length, 14);
    t.is(calendar.activeView.dayContentElement.querySelectorAll('.b-cal-event-wrap[data-resource-id="mats"]').length, 0);
    resourceStore.getById('mats').remove();
    t.is(calendar.activeView.dayContentElement.querySelectorAll('.b-cal-event-wrap[data-resource-id="bryntum"]').length, 6);
    t.is(calendar.activeView.dayContentElement.querySelectorAll('.b-cal-event-wrap[data-resource-id="hotel"]').length, 14);
    t.is(calendar.activeView.dayContentElement.querySelectorAll('.b-cal-event-wrap[data-resource-id="mats"]').length, 0);
    await t.click('[data-ref="resourceFilter"] .b-list-item[data-id="bryntum"]'); // Bryntum team events gone

    await t.waitFor(() => calendar.activeView.dayContentElement.querySelectorAll('.b-cal-event-wrap[data-resource-id="bryntum"]').length === 0);
    t.is(calendar.activeView.dayContentElement.querySelectorAll('.b-cal-event-wrap[data-resource-id="bryntum"]').length, 0);
    t.is(calendar.activeView.dayContentElement.querySelectorAll('.b-cal-event-wrap[data-resource-id="hotel"]').length, 14);
    t.is(calendar.activeView.dayContentElement.querySelectorAll('.b-cal-event-wrap[data-resource-id="mats"]').length, 0);
    await t.click('[data-ref="resourceFilter"] .b-list-item[data-id="hotel"]'); // Remaining hotel events gone too

    await t.waitFor(() => calendar.activeView.dayContentElement.querySelectorAll('.b-cal-event-wrap[data-resource-id="hotel"]').length === 0);
    t.is(calendar.activeView.dayContentElement.querySelectorAll('.b-cal-event-wrap[data-resource-id="bryntum"]').length, 0);
    t.is(calendar.activeView.dayContentElement.querySelectorAll('.b-cal-event-wrap[data-resource-id="hotel"]').length, 0);
    t.is(calendar.activeView.dayContentElement.querySelectorAll('.b-cal-event-wrap[data-resource-id="mats"]').length, 0);
  });
  t.it('resource avatars', async t => {
    calendar = await getCalendar({
      date: new Date(2022, 5, 5),
      crudManager: {
        transport: {
          load: {
            url: '../examples/resource-avatars/data/data.json'
          }
        },
        autoLoad: true
      },
      resourceImagePath: '../examples/_shared/images/users/',
      modeDefaults: {
        eventHeight: 35,
        showResourceAvatars: true,

        // In our app, all events are solid blocks.
        eventRenderer({
          renderData
        }) {
          renderData.solidBar = true;
        }

      },
      mode: 'month'
    });
    await t.dragBy({
      source: '[data-event-id="1"]',
      delta: [100, -100],
      dragOnly: true
    }); // Dragged bar has the avatars

    t.selectorCountIs('.b-cal-event-wrap.b-cal-tentative-event img.b-resource-avatar', 3);
    await t.type(null, '[ESCAPE]');
    await t.dragBy({
      source: '.b-monthview .b-calendar-cell[data-date="2022-06-01"]',
      delta: [300, 0],
      dragOnly: true
    }); // Created bar has the defaultCalendar avatar

    t.selectorCountIs('.b-cal-event-wrap.b-cal-tentative-event img.b-resource-avatar', 1);
    await t.mouseUp(); // Chip view must contain the default calendar

    await t.waitForSelector(`.b-chip:contains(${calendar.defaultCalendar.name})`);
    t.selectorExists(`.b-cal-event-wrap.b-iscreating .b-resource-avatar[data-btip="${calendar.defaultCalendar.name}"]`);
  }); // https://github.com/bryntum/support/issues/2006

  t.it('ResourceFilter in Sidebar should be configurable with custom selection', async t => {
    resourceStore = new ResourceStore({
      data: t.getHackathonData().resources.rows
    });
    calendar = await getCalendar({
      date: new Date(2019, 9, 14),
      events: [],
      resourceStore,
      sidebar: {
        items: {
          resourceFilter: {
            selected: ['hotel']
          }
        }
      }
    }); // Only the one we asked for is selected.

    t.selectorCountIs('.b-list-item.b-selected', 1);
    t.selectorExists('.b-list-item.b-selected[data-id="hotel"]');
  });
});