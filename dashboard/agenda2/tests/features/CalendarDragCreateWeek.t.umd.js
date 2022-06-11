"use strict";

StartTest(t => {
  let harness;
  t.beforeEach(t => {
    var _harness;

    (_harness = harness) === null || _harness === void 0 ? void 0 : _harness.destroy();
    harness = null;
    t.clearPageScroll();
  });
  t.describe('All Day', t => {
    // To clear the "Hackathon 2019" event that spans the whole week:
    const options = {
      offset: ['50%', '100%-20'],
      toOffset: ['50%', '100%-20']
    };
    t.beforeEach(t => {
      harness = t.setupWeekViewAllDayDragHarness();
    });
    t.it('Should do nothing if disabled', async t => {
      await harness.init(t);
      harness.calendar.features.drag.disabled = true;
      await harness.allDayDrag({
        from: '2019-10-16',
        to: '2019-10-16',
        options: {
          offset: ['50%', '100%-20'],
          toOffset: ['50%-10', '100%-20']
        }
      });
      t.notOk(harness.newEventRecord, 'No event created');
    });
    t.it('Should be able to drag slightly left', async t => {
      await harness.init(t);
      await harness.allDayDrag({
        from: '2019-10-16',
        to: '2019-10-16',
        options: {
          offset: ['50%', '100%-20'],
          toOffset: ['50%-10', '100%-20']
        }
      });
      t.isStrict(harness.newEventRecord.allDay, true, 'Correct allDay');
      t.is(harness.newEventRecord.startDate, new Date(2019, 9, 16), 'Correct startDate');
      t.is(harness.newEventRecord.endDate, new Date(2019, 9, 17), 'Correct endDate');
      t.notOk(harness.newEventRecord.recurrence, 'Correct recurrence');
      t.isStrict(harness.occurrences.length, 0, 'Just one occurrence');
    });
    t.it('Should be able to drag slightly right', async t => {
      await harness.init(t);
      await harness.allDayDrag({
        from: '2019-10-16',
        to: '2019-10-16',
        options: {
          offset: ['50%', '100%-20'],
          toOffset: ['50%+10', '100%-20']
        }
      });
      t.isStrict(harness.newEventRecord.allDay, true, 'Correct allDay');
      t.is(harness.newEventRecord.startDate, new Date(2019, 9, 16), 'Correct startDate');
      t.is(harness.newEventRecord.endDate, new Date(2019, 9, 17), 'Correct endDate');
      t.notOk(harness.newEventRecord.recurrence, 'Correct recurrence');
      t.isStrict(harness.occurrences.length, 0, 'Just one occurrence');
    });
    t.it('Should be able to drag left 2 days', async t => {
      await harness.init(t);
      await harness.allDayDrag({
        from: '2019-10-16',
        to: '2019-10-14',
        options
      });
      t.isStrict(harness.newEventRecord.allDay, true, 'Correct allDay');
      t.is(harness.newEventRecord.startDate, new Date(2019, 9, 14), 'Correct startDate');
      t.is(harness.newEventRecord.endDate, new Date(2019, 9, 17), 'Correct endDate');
      t.notOk(harness.newEventRecord.recurrence, 'Correct recurrence');
      t.isStrict(harness.occurrences.length, 0, 'Just one occurrence');
    });
    t.it('Should be able to drag right 2 days', async t => {
      await harness.init(t);
      await harness.allDayDrag({
        from: '2019-10-16',
        to: '2019-10-18',
        options
      });
      t.isStrict(harness.newEventRecord.allDay, true, 'Correct allDay');
      t.is(harness.newEventRecord.startDate, new Date(2019, 9, 16), 'Correct startDate');
      t.is(harness.newEventRecord.endDate, new Date(2019, 9, 19), 'Correct endDate');
      t.notOk(harness.newEventRecord.recurrence, 'Correct recurrence');
      t.isStrict(harness.occurrences.length, 0, 'Just one occurrence');
    });
    t.it('should abort drag operation on ESC keypress', async t => {
      await harness.init(t);
      const cell = await harness.headerCellSelector('2019-10-14');
      const cell2 = await harness.headerCellSelector('2019-10-18');
      await t.dragTo(cell, cell2, null, null, null, true, ['30%', 15], ['30%+50', 15]);
      t.ok(t.isDragging(), 'Dragging is active');
      let tentativeDates = harness.getTentativeDates();
      t.expect(tentativeDates).toEqual([[new Date(2019, 9, 14), new Date(2019, 9, 19), 'New event']]);
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
        const [el, offset] = await harness.hoverEvent(harness.Event.BeerTime, {
          offset: ['100%+10', '50%']
        });
        await harness.drag(el, {
          offset,
          by: [2 * harness.WEEK_PX_PER_DAY, 0]
        });
        await harness.drop();
        await harness.getDragResult();
        t.isStrict(harness.newEventRecord.allDay, true, 'Correct allDay');
        t.is(harness.newEventRecord.startDate, new Date(2019, 9, 15), 'Correct startDate');
        t.is(harness.newEventRecord.endDate, new Date(2019, 9, 18), 'Correct endDate');
        t.notOk(harness.newEventRecord.recurrence, 'Correct recurrence');
        t.isStrict(harness.occurrences.length, 0, 'Just one occurrence');
      });
    });
  });
  t.describe('Day Detail', t => {
    t.beforeEach(t => {
      harness = t.setupWeekViewDragHarness();
    });
    t.it('Should do nothing if disabled', async t => {
      await harness.init(t);
      harness.calendar.features.drag.disabled = true;
      await harness.dayTimeDrag({
        from: {
          date: '2019-10-16',
          time: '2:00'
        },
        to: {
          date: '2019-10-16',
          time: '5:00'
        }
      });
      t.notOk(harness.newEventRecord, 'No event created');
    }); // DOWN

    t.it('Should be able to drag down 3 hours', async t => {
      await harness.init(t);
      await harness.dayTimeDrag({
        from: {
          date: '2019-10-16',
          time: '2:00'
        },
        to: {
          date: '2019-10-16',
          time: '5:00'
        }
      });
      t.isStrict(harness.newEventRecord.allDay, false, 'Correct allDay');
      t.is(harness.newEventRecord.startDate, new Date(2019, 9, 16, 2), 'Correct startDate');
      t.is(harness.newEventRecord.endDate, new Date(2019, 9, 16, 5), 'Correct endDate');
      t.notOk(harness.newEventRecord.recurrence, 'Correct recurrence');
      t.isStrict(harness.occurrences.length, 0, 'Just one occurrence');
    });
    t.it('Should be able to drag down 3 hours and left 2 days', async t => {
      await harness.init(t);
      await harness.dayTimeDrag({
        from: {
          date: '2019-10-16',
          time: '2:00'
        },
        to: {
          date: '2019-10-14',
          time: '5:00'
        }
      });
      t.isStrict(harness.newEventRecord.allDay, false, 'Correct allDay');
      t.is(harness.newEventRecord.startDate, new Date(2019, 9, 14, 5), 'Correct startDate');
      t.is(harness.newEventRecord.endDate, new Date(2019, 9, 16, 2), 'Correct endDate');
      t.notOk(harness.newEventRecord.recurrence, 'Correct recurrence');
      t.isStrict(harness.occurrences.length, 0, 'Just one occurrence');
    });
    t.it('Should be able to drag down 3 hours and left 2 days with recurrence', async t => {
      await harness.init(t);
      await harness.dayTimeDrag({
        keys: '^',
        from: {
          date: '2019-10-16',
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
      t.is(harness.occurrences.length, 3, 'Correct number of occurrences');
      t.is(harness.newEventRecord.recurrence.count, 3, 'Correct recurrence count');
      t.is(harness.newEventRecord.recurrence.frequency, 'DAILY', 'Correct recurrence frequency');
      t.is(harness.newEventRecord.recurrence.interval, 1, 'Correct recurrence interval');
    });
    t.it('Should be able to drag down 3 hours and right 2 days', async t => {
      await harness.init(t);
      await harness.dayTimeDrag({
        from: {
          date: '2019-10-16',
          time: '2:00'
        },
        to: {
          date: '2019-10-18',
          time: '5:00'
        }
      });
      t.isStrict(harness.newEventRecord.allDay, false, 'Correct allDay');
      t.is(harness.newEventRecord.startDate, new Date(2019, 9, 16, 2), 'Correct startDate');
      t.is(harness.newEventRecord.endDate, new Date(2019, 9, 18, 5), 'Correct endDate');
      t.notOk(harness.newEventRecord.recurrence, 'Correct recurrence');
      t.isStrict(harness.occurrences.length, 0, 'Just one occurrence');
    });
    t.it('Should be able to drag down 3 hours and right 2 days with recurrence', async t => {
      await harness.init(t);
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
      t.isStrict(harness.newEventRecord.allDay, false, 'Correct allDay');
      t.is(harness.newEventRecord.startDate, new Date(2019, 9, 16, 2), 'Correct startDate');
      t.is(harness.newEventRecord.endDate, new Date(2019, 9, 16, 5), 'Correct endDate');
      t.is(harness.occurrences.length, 3, 'Correct number of occurrences');
      t.is(harness.newEventRecord.recurrence.count, 3, 'Correct recurrence count');
      t.is(harness.newEventRecord.recurrence.frequency, 'DAILY', 'Correct recurrence frequency');
      t.is(harness.newEventRecord.recurrence.interval, 1, 'Correct recurrence interval');
    }); // UP

    t.it('Should be able to drag up 3 hours', async t => {
      await harness.init(t);
      await harness.dayTimeDrag({
        from: {
          date: '2019-10-16',
          time: '5:00'
        },
        to: {
          date: '2019-10-16',
          time: '2:00'
        }
      });
      t.isStrict(harness.newEventRecord.allDay, false, 'Correct allDay');
      t.is(harness.newEventRecord.startDate, new Date(2019, 9, 16, 2), 'Correct startDate');
      t.is(harness.newEventRecord.endDate, new Date(2019, 9, 16, 5), 'Correct endDate');
      t.notOk(harness.newEventRecord.recurrence, 'Correct recurrence');
      t.isStrict(harness.occurrences.length, 0, 'Just one occurrence');
    });
    t.it('Should be able to drag up 3 hours and left 2 days', async t => {
      await harness.init(t);
      await harness.dayTimeDrag({
        from: {
          date: '2019-10-16',
          time: '5:00'
        },
        to: {
          date: '2019-10-14',
          time: '2:00'
        }
      });
      t.isStrict(harness.newEventRecord.allDay, false, 'Correct allDay');
      t.is(harness.newEventRecord.startDate, new Date(2019, 9, 14, 2), 'Correct startDate');
      t.is(harness.newEventRecord.endDate, new Date(2019, 9, 16, 5), 'Correct endDate');
      t.notOk(harness.newEventRecord.recurrence, 'Correct recurrence');
      t.isStrict(harness.occurrences.length, 0, 'Just one occurrence');
    });
    t.it('Should be able to drag up 3 hours and left 2 days with recurrence', async t => {
      await harness.init(t);
      await harness.dayTimeDrag({
        keys: '^',
        from: {
          date: '2019-10-16',
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
      t.is(harness.occurrences.length, 3, 'Correct number of occurrences');
      t.is(harness.newEventRecord.recurrence.count, 3, 'Correct recurrence count');
      t.is(harness.newEventRecord.recurrence.frequency, 'DAILY', 'Correct recurrence frequency');
      t.is(harness.newEventRecord.recurrence.interval, 1, 'Correct recurrence interval');
    });
    t.it('Should be able to drag up 3 hours and right 2 days', async t => {
      await harness.init(t);
      await harness.dayTimeDrag({
        from: {
          date: '2019-10-16',
          time: '5:00'
        },
        to: {
          date: '2019-10-18',
          time: '2:00'
        }
      });
      t.isStrict(harness.newEventRecord.allDay, false, 'Correct allDay');
      t.is(harness.newEventRecord.startDate, new Date(2019, 9, 16, 5), 'Correct startDate');
      t.is(harness.newEventRecord.endDate, new Date(2019, 9, 18, 2), 'Correct endDate');
      t.notOk(harness.newEventRecord.recurrence, 'Correct recurrence');
      t.isStrict(harness.occurrences.length, 0, 'Just one occurrence');
    });
    t.it('Should be able to drag up 3 hours and right 2 days with recurrence', async t => {
      await harness.init(t);
      await harness.dayTimeDrag({
        keys: '^',
        from: {
          date: '2019-10-16',
          time: '5:00'
        },
        to: {
          date: '2019-10-18',
          time: '2:00'
        }
      });
      t.isStrict(harness.newEventRecord.allDay, false, 'Correct allDay');
      t.is(harness.newEventRecord.startDate, new Date(2019, 9, 16, 2), 'Correct startDate');
      t.is(harness.newEventRecord.endDate, new Date(2019, 9, 16, 5), 'Correct endDate');
      t.is(harness.occurrences.length, 3, 'Correct number of occurrences');
      t.is(harness.newEventRecord.recurrence.count, 3, 'Correct recurrence count');
      t.is(harness.newEventRecord.recurrence.frequency, 'DAILY', 'Correct recurrence frequency');
      t.is(harness.newEventRecord.recurrence.interval, 1, 'Correct recurrence interval');
    });
    t.it('should abort drag operation on ESC keypress', async t => {
      await harness.init(t);
      const [cell, x, y, sx, sy] = await harness.dayXY('2019-10-16', '2:00');
      const [,,, sx1, sy1] = await harness.dayXY('2019-10-16', '5:00');
      await t.dragBy(cell, [sx1 - sx, sy1 - sy], null, null, null, true, [x, y]);
      t.ok(t.isDragging(), 'Dragging is active');
      let tentativeDates = harness.getTentativeDates();
      t.expect(tentativeDates).toEqual([[new Date(2019, 9, 16, 2), new Date(2019, 9, 16, 5), '2 AMNew event5 AM']]);
      await t.type(null, '[ESC]');
      t.notOk(t.isDragging(), 'Dragging is not active');
      tentativeDates = harness.getTentativeDates();
      t.expect(tentativeDates).toEqual([]);
    });
    t.it('Should scroll the view when dragging close to the edge', async t => {
      await harness.init(t, {
        mode: 'week',
        date: new Date(2021, 5, 2),
        modes: {
          week: {
            visibleStartTime: 0
          }
        }
      });
      const {
        calendar
      } = harness,
            {
        activeView
      } = calendar,
            {
        overflowElement
      } = activeView; // Grab coordinates for start date

      let [,,, startDateX, startDateY] = await harness.dayXY('2021-06-02', '12:00'); // Start dragging and move close to the bottom to start scrolling

      await t.dragTo({
        source: [startDateX, startDateY],
        target: overflowElement,
        targetOffset: ['50%', '100%-30'],
        dragOnly: true
      }); // Wait until element is scrolled to the bottom

      await t.waitFor(() => Math.abs(overflowElement.scrollTop + overflowElement.clientHeight - overflowElement.scrollHeight) <= 1); // Finish drag and save the event

      await t.mouseUp();
      let event = calendar.eventStore.last;
      t.is(event.startDate, new Date(2021, 5, 2, 12), 'Start date is ok');
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
            date: '2019-10-16',
            time: '2:00'
          },
          to: {
            date: '2019-10-16',
            time: '5:00'
          }
        });
        t.isStrict(harness.newEventRecord.allDay, false, 'Correct allDay');
        t.is(harness.newEventRecord.startDate, new Date(2019, 9, 16, 2), 'Correct startDate');
        t.is(harness.newEventRecord.endDate, new Date(2019, 9, 16, 5), 'Correct endDate');
        t.notOk(harness.newEventRecord.recurrence, 'Correct recurrence');
        t.isStrict(harness.occurrences.length, 0, 'Just one occurrence');
      });
    });
  });
});