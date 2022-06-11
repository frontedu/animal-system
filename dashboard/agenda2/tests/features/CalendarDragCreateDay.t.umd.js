"use strict";

StartTest(t => {
  let harness, calendar;
  t.beforeEach(t => {
    var _harness, _calendar;

    (_harness = harness) === null || _harness === void 0 ? void 0 : _harness.destroy();
    (_calendar = calendar) === null || _calendar === void 0 ? void 0 : _calendar.destroy();
    harness = calendar = null;
    t.clearPageScroll();
  });
  t.describe('All Day', t => {
    t.beforeEach(t => {
      harness = t.setupDayViewAllDayDragHarness();
    });
    t.it('Should do nothing if disabled', async t => {
      await harness.init(t);
      harness.calendar.features.drag.disabled = true;
      await harness.allDayDrag({
        from: '2019-10-14',
        to: '2019-10-14',
        options: {
          offset: ['30%', 15],
          toOffset: ['30%-50', 15]
        }
      });
      t.notOk(harness.newEventRecord, 'No event created');
    });
    t.it('Should do nothing if validator vetoes', async t => {
      await harness.init(t, {
        features: {
          drag: {
            validateCreateFn: 'up.validateCreate'
          }
        },
        validateCreate: () => false
      });
      await harness.allDayDrag({
        from: '2019-10-14',
        to: '2019-10-14',
        options: {
          offset: ['30%', 15],
          toOffset: ['30%-50', 15]
        }
      });
      t.notOk(harness.newEventRecord, 'No event created');
    });
    t.it('Should be able to drag slightly left', async t => {
      await harness.init(t);
      await harness.allDayDrag({
        from: '2019-10-14',
        to: '2019-10-14',
        options: {
          offset: ['30%', 15],
          toOffset: ['30%-50', 15]
        }
      });
      t.isStrict(harness.newEventRecord.allDay, true, 'Correct allDay');
      t.is(harness.newEventRecord.startDate, new Date(2019, 9, 14), 'Correct startDate');
      t.is(harness.newEventRecord.endDate, new Date(2019, 9, 15), 'Correct endDate');
      t.notOk(harness.newEventRecord.recurrence, 'Correct recurrence');
      t.isStrict(harness.occurrences.length, 0, 'Just one occurrence');
    });
    t.it('Should be able to drag slightly right', async t => {
      await harness.init(t);
      await harness.allDayDrag({
        from: '2019-10-14',
        to: '2019-10-14',
        options: {
          offset: ['30%', 15],
          toOffset: ['30%+50', 15]
        }
      });
      t.isStrict(harness.newEventRecord.allDay, true, 'Correct allDay');
      t.is(harness.newEventRecord.startDate, new Date(2019, 9, 14), 'Correct startDate');
      t.is(harness.newEventRecord.endDate, new Date(2019, 9, 15), 'Correct endDate');
      t.notOk(harness.newEventRecord.recurrence, 'Correct recurrence');
      t.isStrict(harness.occurrences.length, 0, 'Just one occurrence');
    });
    t.it('should abort drag operation on ESC keypress', async t => {
      await harness.init(t);
      const cell = harness.headerCellSelector('2019-10-14');
      const cell2 = harness.headerCellSelector('2019-10-14');
      await t.dragTo(cell, cell2, null, null, null, true, ['30%', 15], ['30%+50', 15]);
      t.ok(t.isDragging(), 'Dragging is active');
      let tentativeDates = harness.getTentativeDates();
      t.expect(tentativeDates).toEqual([[new Date(2019, 9, 14), new Date(2019, 9, 15), 'New event']]);
      await t.type(null, '[ESC]');
      t.notOk(t.isDragging(), 'Dragging is not active');
      tentativeDates = harness.getTentativeDates();
      t.expect(tentativeDates).toEqual([]);
    });
    t.describe('Page scrolled', t => {
      t.beforeEach(() => {
        t.enablePageScroll();
      });
      t.it('should drag when body is scrolled', async t => {
        await harness.init(t);
        await harness.moveCursorTo([300, 300]); // move the cursor away so we get the mouse entry

        const [el, offset] = await harness.hoverEvent(harness.Event.BeerTime, {
          offset: ['50%', '100%+2']
        });
        await harness.drag(el, {
          offset,
          by: [-30, 0]
        });
        await harness.drop();
        await harness.getDragResult();
        t.isStrict(harness.newEventRecord.allDay, true, 'Correct allDay');
        t.is(harness.newEventRecord.startDate, new Date(2019, 9, 14), 'Correct startDate');
        t.is(harness.newEventRecord.endDate, new Date(2019, 9, 15), 'Correct endDate');
        t.notOk(harness.newEventRecord.recurrence, 'Correct recurrence');
        t.isStrict(harness.occurrences.length, 0, 'Just one occurrence');
      });
    });
  });
  t.describe('Day Detail', t => {
    t.beforeEach(t => {
      harness = t.setupDayViewDragHarness();
    });
    t.it('Should do nothing if disabled', async t => {
      await harness.init(t);
      harness.calendar.features.drag.disabled = true;
      await harness.dayTimeDrag({
        from: {
          date: '2019-10-14',
          time: '2:00'
        },
        to: {
          date: '2019-10-14',
          time: '5:00'
        }
      });
      t.notOk(harness.newEventRecord, 'No event created');
    });
    t.it('Should do nothing if validator vetoes', async t => {
      await harness.init(t, {
        features: {
          drag: {
            validateCreateFn: 'up.validateCreate'
          }
        },
        validateCreate: () => false
      });
      await harness.dayTimeDrag({
        from: {
          date: '2019-10-14',
          time: '2:00'
        },
        to: {
          date: '2019-10-14',
          time: '5:00'
        }
      });
      t.notOk(harness.newEventRecord, 'No event created');
    });
    t.it('Should be able to drag down 3 hours', async t => {
      await harness.init(t);
      await harness.dayTimeDrag({
        from: {
          date: '2019-10-14',
          time: '2:00'
        },
        to: {
          date: '2019-10-14',
          time: '5:00'
        }
      });
      t.isStrict(harness.newEventRecord.allDay, false, 'Correct allDay');
      t.is(harness.newEventRecord.startDate, new Date(2019, 9, 14, 2), 'Correct startDate');
      t.is(harness.newEventRecord.endDate, new Date(2019, 9, 14, 5), 'Correct endDate');
      t.notOk(harness.newEventRecord.recurrence, 'Correct recurrence');
      t.isStrict(harness.occurrences.length, 0, 'Just one occurrence');
    });
    t.it('Should abort the edit/create if the created event is dragged', async t => {
      await harness.init(t, {
        features: {
          eventEdit: true
        }
      });
      await harness.dayTimeDrag({
        from: {
          date: '2019-10-14',
          time: '2:00'
        },
        to: {
          date: '2019-10-14',
          time: '5:00'
        }
      });
      const {
        calendar,
        newEventRecord
      } = harness;
      t.isStrict(harness.newEventRecord.allDay, false, 'Correct allDay');
      t.is(newEventRecord.startDate, new Date(2019, 9, 14, 2), 'Correct startDate');
      t.is(newEventRecord.endDate, new Date(2019, 9, 14, 5), 'Correct endDate');
      t.notOk(newEventRecord.recurrence, 'Correct recurrence');
      t.isStrict(harness.occurrences.length, 0, 'Just one occurrence');
      await t.waitFor(() => {
        var _harness$calendar$fea;

        return (_harness$calendar$fea = harness.calendar.features.eventEdit.editor) === null || _harness$calendar$fea === void 0 ? void 0 : _harness$calendar$fea.containsFocus;
      });
      await t.dragBy({
        source: calendar.activeView.getEventElement(newEventRecord),
        offset: [20, '50%'],
        delta: [0, 50]
      });
      await t.waitFor(() => {
        var _harness$calendar$fea2;

        return !((_harness$calendar$fea2 = harness.calendar.features.eventEdit.editor) !== null && _harness$calendar$fea2 !== void 0 && _harness$calendar$fea2.isVisible);
      }); // New event has gone. Not in DOm and not in Store.

      t.notOk(calendar.activeView.getEventElement(newEventRecord));
      t.notOk(newEventRecord.eventStore);
    });
    t.it('should abort drag operation on ESC keypress', async t => {
      await harness.init(t);
      const [cell, sx, sy] = await harness.dayXY('2019-10-14', '2:00');
      const [, sx1, sy1] = await harness.dayXY('2019-10-14', '5:00');
      const dy = sy - sy1;
      await t.dragBy(cell, [sx1 - sx, dy / 3], null, null, null, true, [sx1, sy1]);
      t.ok(t.isDragging(), 'Dragging is active');
      let tentativeDates = harness.getTentativeDates();
      t.expect(tentativeDates).toEqual([[new Date(2019, 9, 14, 4), new Date(2019, 9, 14, 5), '4 AMNew event5 AM']]);
      await t.moveCursorBy([0, 2 * dy / 3]);
      t.ok(t.isDragging(), 'Dragging is active');
      tentativeDates = harness.getTentativeDates();
      t.expect(tentativeDates).toEqual([[new Date(2019, 9, 14, 2), new Date(2019, 9, 14, 5), '2 AMNew event5 AM']]);
      await t.type(null, '[ESC]');
      t.notOk(t.isDragging(), 'Dragging is not active');
      tentativeDates = harness.getTentativeDates();
      t.expect(tentativeDates).toEqual([]);
    });
    t.it('Should be able to drag up 3 hours', async t => {
      await harness.init(t);
      await harness.dayTimeDrag({
        from: {
          date: '2019-10-14',
          time: '5:00'
        },
        to: {
          date: '2019-10-14',
          time: '2:00'
        }
      });
      t.isStrict(harness.newEventRecord.allDay, false, 'Correct allDay');
      t.is(harness.newEventRecord.startDate, new Date(2019, 9, 14, 2), 'Correct startDate');
      t.is(harness.newEventRecord.endDate, new Date(2019, 9, 14, 5), 'Correct endDate');
      t.notOk(harness.newEventRecord.recurrence, 'Correct recurrence');
      t.isStrict(harness.occurrences.length, 0, 'Just one occurrence');
    });
    t.it('Should not try to sync a new event while it is being created', async t => {
      calendar = await t.getCalendar({
        crudManager: {
          autoSync: true,
          transport: {
            sync: {
              url: 'sync'
            }
          }
        },
        date: new Date(2019, 9, 14),
        mode: 'day'
      });
      t.wontFire(calendar.crudManager, 'beforeSync');
      await t.dragBy('.b-dayview-day-detail.b-calendar-cell', [0, 100]);
      t.is(calendar.eventStore.count, 1, '1 event in store');
      t.is(calendar.eventStore.first.isPersistable, false, 'A new Event is not persistable while being edited');
      t.is(calendar.crudManager.changes, null, 'No persistable changes'); // Force a sync attempt

      calendar.crudManager.sync();
      await t.click('.b-button:contains(Cancel)');
      t.is(calendar.eventStore.count, 0, 'No event in store');
      t.is(calendar.eventStore.added.count, 0, 'No added events');
      t.is(calendar.eventStore.removed.count, 0, 'No removed events');
      await calendar.project.commitAsync(); // Force a sync attempt

      calendar.crudManager.sync();
    });
    t.it('Should find event in "added" after being created', async t => {
      calendar = await t.getCalendar({
        crudManager: {
          autoSync: false,
          transport: {
            sync: {
              url: 'sync'
            }
          }
        },
        date: new Date(2019, 9, 14),
        mode: 'day'
      });
      await t.dragBy('.b-dayview-day-detail.b-calendar-cell', [0, 100]);
      await t.type(null, 'a');
      await t.click('.b-button:contains(Save)');
      t.is(calendar.eventStore.added.count, 1, '1 event added');
    });
    t.it('Should not show a tooltip by default', async t => {
      calendar = await t.getCalendar({
        mode: 'day'
      });
      await t.dragBy('.b-dayview-day-detail.b-calendar-cell', [0, 50], null, null, null, true);
      t.selectorNotExists('.b-tooltip', 'No tip');
    });
    t.it('Should show a tooltip if configured to do so with object', async t => {
      calendar = await t.getCalendar({
        mode: 'day',
        features: {
          drag: {
            tooltip: {}
          }
        }
      });
      await t.dragBy('.b-dayview-day-detail.b-calendar-cell', [0, 50], null, null, null, true);
      t.selectorExists('.b-tooltip:contains(New event)', 'Create tip shown');
    });
    t.it('Should show a tooltip if configured to do so with true', async t => {
      calendar = await t.getCalendar({
        mode: 'day',
        features: {
          drag: {
            tooltip: true
          }
        }
      });
      await t.dragBy('.b-dayview-day-detail.b-calendar-cell', [0, 50], null, null, null, true);
      t.selectorExists('.b-tooltip:contains(New event)', 'Create tip shown');
    });
    t.it('Should scroll the view when dragging close to the edge', async t => {
      calendar = await t.getCalendar({
        mode: 'day',
        date: new Date(2021, 5, 2),
        modes: {
          day: {
            visibleStartTime: 0
          }
        }
      });
      const {
        activeView
      } = calendar,
            {
        overflowElement
      } = activeView; // Grab coordinates for start date

      let [,,, startDateX, startDateY] = await harness.dayXY('2021-06-02', '04:00'); // Start dragging and move close to the bottom to start scrolling

      await t.dragTo({
        source: [startDateX, startDateY],
        target: overflowElement,
        targetOffset: ['50%', '100%-30'],
        dragOnly: true
      }); // Wait until element is scrolled to the bottom

      await t.waitFor(() => Math.abs(overflowElement.scrollTop + overflowElement.clientHeight - overflowElement.scrollHeight) <= 1);
      const {
        scrollTop
      } = overflowElement; // Finish drag and save the event

      await t.mouseUp();
      await t.type('input[name="name"]', 'New event 1[ENTER]');
      t.is(overflowElement.scrollTop, scrollTop, 'Top scroll is intact after mouseup');
      let event = calendar.eventStore.last;
      t.is(event.startDate, new Date(2021, 5, 2, 4), 'Start date is ok');
      t.isGreaterOrEqual(event.endDate, new Date(2021, 5, 2, 23), 'End date is ok');
      event.remove();
      [,,, startDateX, startDateY] = await harness.dayXY('2021-06-02', '12:00');
      await t.dragTo({
        source: [startDateX, startDateY],
        target: overflowElement,
        targetOffset: ['50%', 30],
        dragOnly: true
      });
      await t.waitFor(() => overflowElement.scrollTop <= 1);
      await t.mouseUp();
      await t.type('input[name="name"]', 'New event 2[ENTER]');
      event = calendar.eventStore.last;
      t.isLessOrEqual(event.startDate, new Date(2021, 5, 2, 1), 'Start date is ok');
      t.is(event.endDate, new Date(2021, 5, 2, 12), 'End date is ok');
    });
    t.describe('Page scrolled', t => {
      t.beforeEach(() => {
        t.enablePageScroll();
      });
      t.it('should drag when body is scrolled', async t => {
        await harness.init(t);
        await harness.dayTimeDrag({
          from: {
            date: '2019-10-14',
            time: '2:00'
          },
          to: {
            date: '2019-10-14',
            time: '5:00'
          }
        });
        t.isStrict(harness.newEventRecord.allDay, false, 'Correct allDay');
        t.is(harness.newEventRecord.startDate, new Date(2019, 9, 14, 2), 'Correct startDate');
        t.is(harness.newEventRecord.endDate, new Date(2019, 9, 14, 5), 'Correct endDate');
        t.notOk(harness.newEventRecord.recurrence, 'Correct recurrence');
        t.isStrict(harness.occurrences.length, 0, 'Just one occurrence');
      });
    });
  });
  t.it('Drag-create and drag-resize into a different zone should not throw errors', async t => {
    const eventStore = new EventStore({
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
    const resourceStore = new ResourceStore({
      data: t.getHackathonData().resources.rows
    });
    calendar = await t.getCalendar({
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
});