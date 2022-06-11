"use strict";

StartTest(t => {
  let harness;
  t.beforeEach(t => {
    var _harness;

    (_harness = harness) === null || _harness === void 0 ? void 0 : _harness.destroy();
    harness = null;
    t.clearPageScroll();
    harness = t.setupYearViewDragHarness();
  });
  t.it('Should do nothing if disabled', async t => {
    await harness.init(t);
    harness.calendar.features.drag.disabled = true;
    await harness.allDayDrag({
      from: '2019-05-15',
      to: '2019-05-15',
      options: {
        offset: ['50%+10', 15],
        toOffset: ['50%-10', 15]
      }
    });
    t.notOk(harness.newEventRecord, 'No event created');
  });
  t.it('Should be able to drag slightly left', async t => {
    await harness.init(t);
    await harness.allDayDrag({
      from: '2019-05-15',
      to: '2019-05-15',
      options: {
        offset: ['50%+10', 15],
        toOffset: ['50%-10', 15]
      }
    });
    t.isStrict(harness.newEventRecord.allDay, true, 'Correct allDay');
    t.is(harness.newEventRecord.startDate, new Date(2019, 4, 15), 'Correct startDate');
    t.is(harness.newEventRecord.endDate, new Date(2019, 4, 16), 'Correct endDate');
    t.notOk(harness.newEventRecord.recurrence, 'Correct recurrence');
    t.isStrict(harness.occurrences.length, 0, 'Just one occurrence');
  });
  t.it('Should be able to drag slightly right', async t => {
    await harness.init(t);
    await harness.allDayDrag({
      from: '2019-05-15',
      to: '2019-05-15',
      options: {
        offset: ['50%-10', 15],
        toOffset: ['50%+10', 15]
      }
    });
    t.isStrict(harness.newEventRecord.allDay, true, 'Correct allDay');
    t.is(harness.newEventRecord.startDate, new Date(2019, 4, 15), 'Correct startDate');
    t.is(harness.newEventRecord.endDate, new Date(2019, 4, 16), 'Correct endDate');
    t.notOk(harness.newEventRecord.recurrence, 'Correct recurrence');
    t.isStrict(harness.occurrences.length, 0, 'Just one occurrence');
  });
  t.it('Should be able to drag left 2 days', async t => {
    await harness.init(t);
    await harness.allDayDrag({
      from: '2019-05-15',
      to: '2019-05-13'
    });
    t.isStrict(harness.newEventRecord.allDay, true, 'Correct allDay');
    t.is(harness.newEventRecord.startDate, new Date(2019, 4, 13), 'Correct startDate');
    t.is(harness.newEventRecord.endDate, new Date(2019, 4, 16), 'Correct endDate');
    t.notOk(harness.newEventRecord.recurrence, 'Correct recurrence');
    t.isStrict(harness.occurrences.length, 0, 'Just one occurrence');
  });
  t.it('Should be able to drag right 2 days', async t => {
    await harness.init(t);
    await harness.allDayDrag({
      from: '2019-05-15',
      to: '2019-05-17'
    });
    t.isStrict(harness.newEventRecord.allDay, true, 'Correct allDay');
    t.is(harness.newEventRecord.startDate, new Date(2019, 4, 15), 'Correct startDate');
    t.is(harness.newEventRecord.endDate, new Date(2019, 4, 18), 'Correct endDate');
    t.notOk(harness.newEventRecord.recurrence, 'Correct recurrence');
    t.isStrict(harness.occurrences.length, 0, 'Just one occurrence');
  });
  t.it('Should be able to drag left 2 days and down 2 weeks', async t => {
    await harness.init(t);
    await harness.allDayDrag({
      from: '2019-05-15',
      to: '2019-05-27'
    });
    t.isStrict(harness.newEventRecord.allDay, true, 'Correct allDay');
    t.is(harness.newEventRecord.startDate, new Date(2019, 4, 15), 'Correct startDate');
    t.is(harness.newEventRecord.endDate, new Date(2019, 4, 28), 'Correct endDate');
    t.notOk(harness.newEventRecord.recurrence, 'Correct recurrence');
    t.isStrict(harness.occurrences.length, 0, 'Just one occurrence');
  });
  t.it('Should be able to drag right 2 days and down 2 weeks', async t => {
    await harness.init(t);
    await harness.allDayDrag({
      from: '2019-05-15',
      to: '2019-05-31'
    });
    t.isStrict(harness.newEventRecord.allDay, true, 'Correct allDay');
    t.is(harness.newEventRecord.startDate, new Date(2019, 4, 15), 'Correct startDate');
    t.is(harness.newEventRecord.endDate, new Date(2019, 5, 1), 'Correct endDate');
    t.notOk(harness.newEventRecord.recurrence, 'Correct recurrence');
    t.isStrict(harness.occurrences.length, 0, 'Just one occurrence');
  });
  t.it('Should be able to drag left 1 day and up 2 weeks', async t => {
    await harness.init(t);
    await harness.allDayDrag({
      from: '2019-05-22',
      to: '2019-05-06'
    });
    t.isStrict(harness.newEventRecord.allDay, true, 'Correct allDay');
    t.is(harness.newEventRecord.startDate, new Date(2019, 4, 6), 'Correct startDate');
    t.is(harness.newEventRecord.endDate, new Date(2019, 4, 23), 'Correct endDate');
    t.notOk(harness.newEventRecord.recurrence, 'Correct recurrence');
    t.isStrict(harness.occurrences.length, 0, 'Just one occurrence');
  });
  t.it('Should be able to drag right 2 days and up 2 weeks', async t => {
    await harness.init(t);
    await harness.allDayDrag({
      from: '2019-05-22',
      to: '2019-05-10'
    });
    t.isStrict(harness.newEventRecord.allDay, true, 'Correct allDay');
    t.is(harness.newEventRecord.startDate, new Date(2019, 4, 10), 'Correct startDate');
    t.is(harness.newEventRecord.endDate, new Date(2019, 4, 23), 'Correct endDate');
    t.notOk(harness.newEventRecord.recurrence, 'Correct recurrence');
    t.isStrict(harness.occurrences.length, 0, 'Just one occurrence');
  });
  t.it('Should be able to drag left 1 month, 4 weeks', async t => {
    await harness.init(t);
    await harness.allDayDrag({
      from: '2019-06-20',
      to: '2019-04-24'
    });
    t.isStrict(harness.newEventRecord.allDay, true, 'Correct allDay');
    t.is(harness.newEventRecord.startDate, new Date(2019, 3, 24), 'Correct startDate');
    t.is(harness.newEventRecord.endDate, new Date(2019, 5, 21), 'Correct endDate');
    t.notOk(harness.newEventRecord.recurrence, 'Correct recurrence');
    t.isStrict(harness.occurrences.length, 0, 'Just one occurrence');
  });
  t.it('Should be able to drag right 2 months', async t => {
    await harness.init(t);
    await harness.allDayDrag({
      from: '2019-04-07',
      to: '2019-06-05'
    });
    t.isStrict(harness.newEventRecord.allDay, true, 'Correct allDay');
    t.is(harness.newEventRecord.startDate, new Date(2019, 3, 7), 'Correct startDate');
    t.is(harness.newEventRecord.endDate, new Date(2019, 5, 6), 'Correct endDate');
    t.notOk(harness.newEventRecord.recurrence, 'Correct recurrence');
    t.isStrict(harness.occurrences.length, 0, 'Just one occurrence');
  });
  t.it('Should be able to drag left 2 months and up 2 months', async t => {
    await harness.init(t);
    await harness.allDayDrag({
      from: '2019-09-24',
      to: '2019-01-14'
    });
    t.isStrict(harness.newEventRecord.allDay, true, 'Correct allDay');
    t.is(harness.newEventRecord.startDate, new Date(2019, 0, 14), 'Correct startDate');
    t.is(harness.newEventRecord.endDate, new Date(2019, 8, 25), 'Correct endDate');
    t.notOk(harness.newEventRecord.recurrence, 'Correct recurrence');
    t.isStrict(harness.occurrences.length, 0, 'Just one occurrence');
  });
  t.it('Should be able to drag right 2 months and up 2 months', async t => {
    await harness.init(t);
    await harness.allDayDrag({
      from: '2019-07-24',
      to: '2019-03-13'
    });
    t.isStrict(harness.newEventRecord.allDay, true, 'Correct allDay');
    t.is(harness.newEventRecord.startDate, new Date(2019, 2, 13), 'Correct startDate');
    t.is(harness.newEventRecord.endDate, new Date(2019, 6, 25), 'Correct endDate');
    t.notOk(harness.newEventRecord.recurrence, 'Correct recurrence');
    t.isStrict(harness.occurrences.length, 0, 'Just one occurrence');
  });
  t.it('Should be able to drag right 2 months and down 2 months', async t => {
    await harness.init(t, {
      height: 800
    });
    await harness.allDayDrag({
      from: '2019-01-14',
      to: '2019-09-24'
    });
    t.isStrict(harness.newEventRecord.allDay, true, 'Correct allDay');
    t.is(harness.newEventRecord.startDate, new Date(2019, 0, 14), 'Correct startDate');
    t.is(harness.newEventRecord.endDate, new Date(2019, 8, 25), 'Correct endDate');
    t.notOk(harness.newEventRecord.recurrence, 'Correct recurrence');
    t.isStrict(harness.occurrences.length, 0, 'Just one occurrence');
  });
  t.it('Should be able to drag left 2 months and down 2 months', async t => {
    await harness.init(t, {
      height: 800
    });
    await harness.allDayDrag({
      from: '2019-03-13',
      to: '2019-07-24'
    });
    t.isStrict(harness.newEventRecord.allDay, true, 'Correct allDay');
    t.is(harness.newEventRecord.startDate, new Date(2019, 2, 13), 'Correct startDate');
    t.is(harness.newEventRecord.endDate, new Date(2019, 6, 25), 'Correct endDate');
    t.notOk(harness.newEventRecord.recurrence, 'Correct recurrence');
    t.isStrict(harness.occurrences.length, 0, 'Just one occurrence');
  });
  t.it('should abort drag operation on ESC keypress', async t => {
    await harness.init(t);
    const cell = await harness.cellSelector('2019-03-13');
    const cell2 = await harness.cellSelector('2019-03-11');
    await t.dragTo(cell, cell2, null, null, null, true);
    t.ok(t.isDragging(), 'Dragging is active');
    let tentativeDates = harness.getTentativeDates();
    t.expect(tentativeDates).toEqual([new Date(2019, 2, 11), new Date(2019, 2, 12), new Date(2019, 2, 13)]);
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
      const el = await harness.hoverDate('2019-10-25');
      await harness.drag(el, {
        by: [0, 0]
      });
      await harness.hoverDate('2019-10-22');
      await harness.drop();
      await harness.getDragResult();
      t.isStrict(harness.newEventRecord.allDay, true, 'Correct allDay');
      t.is(harness.newEventRecord.startDate, new Date(2019, 9, 22), 'Correct startDate');
      t.is(harness.newEventRecord.endDate, new Date(2019, 9, 26), 'Correct endDate');
      t.notOk(harness.newEventRecord.recurrence, 'Correct recurrence');
      t.isStrict(harness.occurrences.length, 0, 'Just one occurrence');
    });
  });
});