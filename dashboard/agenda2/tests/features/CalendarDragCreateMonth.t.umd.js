"use strict";

StartTest(t => {
  const options = {
    offset: ['50%', 15],
    toOffset: ['50%', 15]
  };
  let harness;
  t.beforeEach(t => {
    var _harness;

    (_harness = harness) === null || _harness === void 0 ? void 0 : _harness.destroy();
    harness = null;
    t.clearPageScroll();
    harness = t.setupMonthViewDragHarness();
  });
  t.it('Should do nothing if disabled', async t => {
    await harness.init(t);
    harness.calendar.features.drag.disabled = true;
    await harness.allDayDrag({
      from: '2019-10-16',
      to: '2019-10-16',
      options: {
        offset: ['50%', 15],
        toOffset: ['50%-20', 15]
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
        offset: ['50%', 15],
        toOffset: ['50%-20', 15]
      }
    });
    const view = await harness.getView();
    t.is(harness.newEventRecord.resource, view.defaultCalendar, 'Default calendar used correctly');
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
        offset: ['50%', 15],
        toOffset: ['50%+20', 15]
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
  t.it('Should be able to drag up 2 weeks', async t => {
    await harness.init(t);
    await harness.allDayDrag({
      from: '2019-10-16',
      to: '2019-10-02',
      options
    });
    t.isStrict(harness.newEventRecord.allDay, true, 'Correct allDay');
    t.is(harness.newEventRecord.startDate, new Date(2019, 9, 2), 'Correct startDate');
    t.is(harness.newEventRecord.endDate, new Date(2019, 9, 17), 'Correct endDate');
    t.notOk(harness.newEventRecord.recurrence, 'Correct recurrence');
    t.isStrict(harness.occurrences.length, 0, 'Just one occurrence');
  });
  t.it('Should be able to drag down 2 weeks', async t => {
    await harness.init(t);
    await harness.allDayDrag({
      from: '2019-10-16',
      to: '2019-10-30',
      options
    });
    t.isStrict(harness.newEventRecord.allDay, true, 'Correct allDay');
    t.is(harness.newEventRecord.startDate, new Date(2019, 9, 16), 'Correct startDate');
    t.is(harness.newEventRecord.endDate, new Date(2019, 9, 31), 'Correct endDate');
    t.notOk(harness.newEventRecord.recurrence, 'Correct recurrence');
    t.isStrict(harness.occurrences.length, 0, 'Just one occurrence');
  });
  t.it('Should be able to drag left 2 days and down 2 weeks', async t => {
    await harness.init(t);
    await harness.allDayDrag({
      from: '2019-10-16',
      to: '2019-10-28',
      options
    });
    t.isStrict(harness.newEventRecord.allDay, true, 'Correct allDay');
    t.is(harness.newEventRecord.startDate, new Date(2019, 9, 16), 'Correct startDate');
    t.is(harness.newEventRecord.endDate, new Date(2019, 9, 29), 'Correct endDate');
    t.notOk(harness.newEventRecord.recurrence, 'Correct recurrence');
    t.isStrict(harness.occurrences.length, 0, 'Just one occurrence');
  });
  t.it('Should be able to drag right 2 days and down 2 weeks', async t => {
    await harness.init(t);
    await harness.allDayDrag({
      from: '2019-10-16',
      to: '2019-11-01',
      options
    });
    t.isStrict(harness.newEventRecord.allDay, true, 'Correct allDay');
    t.is(harness.newEventRecord.startDate, new Date(2019, 9, 16), 'Correct startDate');
    t.is(harness.newEventRecord.endDate, new Date(2019, 10, 2), 'Correct endDate');
    t.notOk(harness.newEventRecord.recurrence, 'Correct recurrence');
    t.isStrict(harness.occurrences.length, 0, 'Just one occurrence');
  });
  t.it('Should be able to drag left 1 day and up 2 weeks', async t => {
    await harness.init(t);
    await harness.allDayDrag({
      from: '2019-10-16',
      to: '2019-10-01',
      options
    });
    t.isStrict(harness.newEventRecord.allDay, true, 'Correct allDay');
    t.is(harness.newEventRecord.startDate, new Date(2019, 9, 1), 'Correct startDate');
    t.is(harness.newEventRecord.endDate, new Date(2019, 9, 17), 'Correct endDate');
    t.notOk(harness.newEventRecord.recurrence, 'Correct recurrence');
    t.isStrict(harness.occurrences.length, 0, 'Just one occurrence');
  });
  t.it('Should be able to drag right 2 days and up 2 weeks', async t => {
    await harness.init(t);
    await harness.allDayDrag({
      from: '2019-10-16',
      to: '2019-10-04',
      options
    });
    t.isStrict(harness.newEventRecord.allDay, true, 'Correct allDay');
    t.is(harness.newEventRecord.startDate, new Date(2019, 9, 4), 'Correct startDate');
    t.is(harness.newEventRecord.endDate, new Date(2019, 9, 17), 'Correct endDate');
    t.notOk(harness.newEventRecord.recurrence, 'Correct recurrence');
    t.isStrict(harness.occurrences.length, 0, 'Just one occurrence');
  });
  t.it('Should be able to drag up 2 weeks with recurrence', async t => {
    await harness.init(t);
    await harness.allDayDrag({
      keys: '^',
      from: '2019-10-16',
      to: '2019-10-02',
      options
    });
    t.isStrict(harness.newEventRecord.allDay, true, 'Correct allDay');
    t.is(harness.newEventRecord.startDate, new Date(2019, 9, 2), 'Correct startDate');
    t.is(harness.newEventRecord.endDate, new Date(2019, 9, 3), 'Correct endDate');
    t.is(harness.occurrences.length, 3, 'Correct number of occurrences');
    t.is(harness.newEventRecord.recurrence.count, 3, 'Correct recurrence count');
    t.is(harness.newEventRecord.recurrence.frequency, 'WEEKLY', 'Correct recurrence frequency');
    t.is(harness.newEventRecord.recurrence.interval, 1, 'Correct recurrence interval');
  });
  t.it('Should be able to drag down 2 weeks with recurrence', async t => {
    await harness.init(t);
    await harness.allDayDrag({
      keys: '^',
      from: '2019-10-16',
      to: '2019-10-30',
      options
    });
    t.isStrict(harness.newEventRecord.allDay, true, 'Correct allDay');
    t.is(harness.newEventRecord.startDate, new Date(2019, 9, 16), 'Correct startDate');
    t.is(harness.newEventRecord.endDate, new Date(2019, 9, 17), 'Correct endDate');
    t.is(harness.occurrences.length, 3, 'Correct number of occurrences');
    t.is(harness.newEventRecord.recurrence.count, 3, 'Correct recurrence count');
    t.is(harness.newEventRecord.recurrence.frequency, 'WEEKLY', 'Correct recurrence frequency');
    t.is(harness.newEventRecord.recurrence.interval, 1, 'Correct recurrence interval');
  });
  t.it('Should be able to drag left 2 days and down 2 weeks with recurrence', async t => {
    await harness.init(t);
    await harness.allDayDrag({
      keys: '^',
      from: '2019-10-16',
      to: '2019-10-28',
      options
    });
    t.isStrict(harness.newEventRecord.allDay, true, 'Correct allDay');
    t.is(harness.newEventRecord.startDate, new Date(2019, 9, 14), 'Correct startDate');
    t.is(harness.newEventRecord.endDate, new Date(2019, 9, 17), 'Correct endDate');
    t.is(harness.occurrences.length, 3, 'Correct number of occurrences');
    t.is(harness.newEventRecord.recurrence.count, 3, 'Correct recurrence count');
    t.is(harness.newEventRecord.recurrence.frequency, 'WEEKLY', 'Correct recurrence frequency');
    t.is(harness.newEventRecord.recurrence.interval, 1, 'Correct recurrence interval');
  });
  t.it('Should be able to drag right 2 days and down 2 weeks with recurrence', async t => {
    await harness.init(t);
    await harness.allDayDrag({
      keys: '^',
      from: '2019-10-16',
      to: '2019-11-01',
      options
    });
    t.isStrict(harness.newEventRecord.allDay, true, 'Correct allDay');
    t.is(harness.newEventRecord.startDate, new Date(2019, 9, 16), 'Correct startDate');
    t.is(harness.newEventRecord.endDate, new Date(2019, 9, 19), 'Correct endDate');
    t.is(harness.occurrences.length, 3, 'Correct number of occurrences');
    t.is(harness.newEventRecord.recurrence.count, 3, 'Correct recurrence count');
    t.is(harness.newEventRecord.recurrence.frequency, 'WEEKLY', 'Correct recurrence frequency');
    t.is(harness.newEventRecord.recurrence.interval, 1, 'Correct recurrence interval');
  });
  t.it('Should be able to drag left 1 day and up 2 weeks with recurrence', async t => {
    await harness.init(t);
    await harness.allDayDrag({
      keys: '^',
      from: '2019-10-16',
      to: '2019-10-01',
      options
    });
    t.isStrict(harness.newEventRecord.allDay, true, 'Correct allDay');
    t.is(harness.newEventRecord.startDate, new Date(2019, 9, 1), 'Correct startDate');
    t.is(harness.newEventRecord.endDate, new Date(2019, 9, 3), 'Correct endDate');
    t.is(harness.occurrences.length, 3, 'Correct number of occurrences');
    t.is(harness.newEventRecord.recurrence.count, 3, 'Correct recurrence count');
    t.is(harness.newEventRecord.recurrence.frequency, 'WEEKLY', 'Correct recurrence frequency');
    t.is(harness.newEventRecord.recurrence.interval, 1, 'Correct recurrence interval');
  });
  t.it('Should be able to drag right 2 days and up 2 weeks with recurrence', async t => {
    await harness.init(t);
    await harness.allDayDrag({
      keys: '^',
      from: '2019-10-16',
      to: '2019-10-04',
      options
    });
    t.isStrict(harness.newEventRecord.allDay, true, 'Correct allDay');
    t.is(harness.newEventRecord.startDate, new Date(2019, 9, 2), 'Correct startDate');
    t.is(harness.newEventRecord.endDate, new Date(2019, 9, 5), 'Correct endDate');
    t.is(harness.occurrences.length, 3, 'Correct number of occurrences');
    t.is(harness.newEventRecord.recurrence.count, 3, 'Correct recurrence count');
    t.is(harness.newEventRecord.recurrence.frequency, 'WEEKLY', 'Correct recurrence frequency');
    t.is(harness.newEventRecord.recurrence.interval, 1, 'Correct recurrence interval');
  });
  t.it('should abort drag operation on ESC keypress', async t => {
    await harness.init(t);
    const cell = await harness.cellSelector('2019-10-07');
    const cell2 = await harness.cellSelector('2019-10-09');
    await t.dragTo(cell, cell2, null, null, null, true);
    t.ok(t.isDragging(), 'Dragging is active');
    let tentativeDates = harness.getTentativeDates();
    t.expect(tentativeDates).toEqual([[new Date(2019, 9, 7), new Date(2019, 9, 10), 'New event']]);
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
        offset: ['50%', `0%-${harness.calendar.modes.month.eventHeight * 2}`]
      });
      await harness.drag(el, {
        offset,
        by: [2 * harness.MONTH_PX_PER_DAY, 0]
      });
      await harness.drop();
      await harness.getDragResult();
      const view = await harness.getView();
      t.is(harness.newEventRecord.resource, view.defaultCalendar, 'Default calendar used correctly');
      t.isStrict(harness.newEventRecord.allDay, true, 'Correct allDay');
      t.is(harness.newEventRecord.startDate, new Date(2019, 9, 14), 'Correct startDate');
      t.is(harness.newEventRecord.endDate, new Date(2019, 9, 17), 'Correct endDate');
      t.notOk(harness.newEventRecord.recurrence, 'Correct recurrence');
      t.isStrict(harness.occurrences.length, 0, 'Just one occurrence');
    });
  });
  t.it('Should be able to drag create with edit', async t => {
    await harness.init(t, {
      events: [],
      features: {
        eventEdit: true
      }
    });
    await harness.allDayDrag({
      from: '2019-10-18',
      to: '2019-10-12',
      options
    });
    await t.waitFor(() => {
      var _harness$calendar$fea;

      return (_harness$calendar$fea = harness.calendar.features.eventEdit.editor) === null || _harness$calendar$fea === void 0 ? void 0 : _harness$calendar$fea.isVisible;
    });
    t.isStrict(harness.newEventRecord.allDay, true, 'Correct allDay');
    t.is(harness.newEventRecord.startDate, new Date(2019, 9, 12), 'Correct startDate');
    t.is(harness.newEventRecord.endDate, new Date(2019, 9, 19), 'Correct endDate');
    t.notOk(harness.newEventRecord.recurrence, 'Correct recurrence');
    t.isStrict(harness.occurrences.length, 0, 'Just one occurrence');
    await t.type(null, '[ESC]');
    await harness.allDayDrag({
      from: '2019-11-09',
      to: '2019-09-29',
      options
    });
    await t.waitFor(() => {
      var _harness$calendar$fea2;

      return (_harness$calendar$fea2 = harness.calendar.features.eventEdit.editor) === null || _harness$calendar$fea2 === void 0 ? void 0 : _harness$calendar$fea2.isVisible;
    });
    t.isStrict(harness.newEventRecord.allDay, true, 'Correct allDay');
    t.is(harness.newEventRecord.startDate, new Date(2019, 8, 29), 'Correct startDate');
    t.is(harness.newEventRecord.endDate, new Date(2019, 10, 10), 'Correct endDate');
    t.notOk(harness.newEventRecord.recurrence, 'Correct recurrence');
    t.isStrict(harness.occurrences.length, 0, 'Just one occurrence');
    await t.type(null, '[ESC]');
    t.is(harness.calendar.eventStore.count, 0);
  });
  t.it('Should be able to drag create with editor after async confirmation dialog, accept', async t => {
    await harness.init(t, {
      events: [],
      features: {
        eventEdit: true
      },
      listeners: {
        beforeDragCreateEnd: async ({
          context
        }) => {
          const result = await MessageDialog.confirm({
            title: 'Please confirm',
            message: 'Is this what you want, what you really really want?'
          }); // Return true to accept the drop or false to reject it

          return result === MessageDialog.yesButton;
        }
      }
    });
    t.firesOnce(harness.calendar, 'beforeDragCreateEnd');
    t.firesOnce(harness.calendar, 'dragCreateEnd');
    t.firesOnce(harness.calendar.eventStore, 'add');
    await harness.allDayDrag({
      from: '2019-10-18',
      to: '2019-10-12',
      options
    });
    await t.click('button:contains(OK)');
    await t.waitFor(() => {
      var _harness$calendar$fea3;

      return (_harness$calendar$fea3 = harness.calendar.features.eventEdit.editor) === null || _harness$calendar$fea3 === void 0 ? void 0 : _harness$calendar$fea3.isVisible;
    });
    const newEventRecord = harness.calendar.eventStore.first,
          occurrences = newEventRecord.getOccurrencesForDateRange(new Date(2019, 0, 1), new Date(2020, 0, 1));
    t.isStrict(newEventRecord.allDay, true, 'Correct allDay');
    t.is(newEventRecord.startDate, new Date(2019, 9, 12), 'Correct startDate');
    t.is(newEventRecord.endDate, new Date(2019, 9, 19), 'Correct endDate');
    t.notOk(newEventRecord.recurrence, 'Correct recurrence');
    t.isStrict(occurrences.length, 0, 'Just one occurrence');
  });
  t.it('Should be able to drag create with editor after async confirmation dialog, reject', async t => {
    var _harness$calendar$fea4;

    await harness.init(t, {
      events: [],
      features: {
        eventEdit: true
      },
      listeners: {
        beforeDragCreateEnd: async ({
          context
        }) => {
          const result = await MessageDialog.confirm({
            title: 'Please confirm',
            message: 'Is this what you want, what you really really want?'
          }); // Return true to accept the drop or false to reject it

          return result === MessageDialog.yesButton;
        }
      }
    });
    t.firesOnce(harness.calendar, 'beforeDragCreateEnd');
    t.wontFire(harness.calendar, 'dragCreateEnd');
    t.wontFire(harness.calendar.eventStore, 'add');
    await harness.allDayDrag({
      from: '2019-10-18',
      to: '2019-10-12',
      options
    });
    await t.click('button:contains(Cancel)');
    t.notOk((_harness$calendar$fea4 = harness.calendar.features.eventEdit.editor) === null || _harness$calendar$fea4 === void 0 ? void 0 : _harness$calendar$fea4.isVisible);
    t.is(harness.calendar.eventStore.count, 0, 'EventStore empty');
  });
  t.it('Should scroll the view when dragging close to the edge', async t => {
    await harness.init(t, {
      mode: 'month',
      date: new Date(2021, 5, 2),
      height: 300
    });
    const {
      calendar
    } = harness,
          overflowElement = calendar.viewContainer.element; // Grab coordinates for start date

    let [,,, startDateX, startDateY] = await harness.dayXY('2021-06-02'); // Start dragging and move close to the bottom to start scrolling

    await t.dragTo({
      source: [startDateX, startDateY],
      target: overflowElement,
      targetOffset: ['50%', '100%-30'],
      dragOnly: true
    }); // Wait until element is scrolled to the bottom

    await t.waitFor(() => Math.abs(overflowElement.scrollTop + overflowElement.clientHeight - overflowElement.scrollHeight) <= 1); // Finish drag and save the event

    await t.mouseUp();
    let event = calendar.eventStore.last;
    t.is(event.startDate, new Date(2021, 5, 2), 'Start date is ok');
    t.is(event.endDate, new Date(2021, 6, 8), 'End date is ok');
    event.remove();
    [,,, startDateX, startDateY] = await harness.dayXY('2021-07-07');
    await t.dragTo({
      source: [startDateX, startDateY],
      target: overflowElement,
      targetOffset: ['50%', 30],
      dragOnly: true
    });
    await t.waitFor(() => overflowElement.scrollTop <= 1);
    const targetEl = await harness.getCell('2021-06-02');
    await t.mouseUp(targetEl);
    event = calendar.eventStore.last;
    t.is(event.startDate, new Date(2021, 5, 2), 'Start date is ok');
    t.is(event.endDate, new Date(2021, 6, 8), 'End date is ok');
  });
});