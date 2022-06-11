"use strict";

StartTest(t => {
  let el, h, eventRecord, offset, overflow, tentativeDates;
  t.beforeEach(t => {
    var _h;

    (_h = h) === null || _h === void 0 ? void 0 : _h.destroy();
    el = h = null;
    t.clearPageScroll();
    h = t.setupYearViewDragHarness();
  });
  t.it('Should do nothing if disabled', async t => {
    await h.init(t);
    h.calendar.features.drag.disabled = true;
    overflow = await h.overflowPopup('2019-10-15');
    const eventRecord = h.eventStore.getById(h.Event.TeamScrum);
    t.is(eventRecord.startDate, new Date(2019, 9, 15, 10), 'Correct startDate');
    t.is(eventRecord.endDate, new Date(2019, 9, 15, 12), 'Correct endDate');
    [el, offset] = await overflow.hoverEvent(eventRecord.id);
    await h.drag(el, {
      offset
    });
    await h.hoverDate('2019-10-25');
    tentativeDates = h.getTentativeDates();
    t.expect(tentativeDates).toEqual([]);
    await h.drop();
    t.notOk(eventRecord.isModified, 'Event was not modified');
    t.is(eventRecord.startDate, new Date(2019, 9, 15, 10), 'Correct startDate');
    t.is(eventRecord.endDate, new Date(2019, 9, 15, 12), 'Correct endDate');
  });
  t.it('Should drag an intra-day event out of overflow to new date', async t => {
    await h.init(t);
    overflow = await h.overflowPopup('2019-10-15');
    const eventRecord = h.eventStore.getById(h.Event.TeamScrum);
    t.is(eventRecord.startDate, new Date(2019, 9, 15, 10), 'Correct startDate');
    t.is(eventRecord.endDate, new Date(2019, 9, 15, 12), 'Correct endDate');
    [el, offset] = await overflow.hoverEvent(eventRecord.id);
    await h.drag(el, {
      offset
    });
    await h.hoverDate('2019-10-25');
    tentativeDates = h.getTentativeDates();
    t.expect(tentativeDates).toEqual([new Date(2019, 9, 25)]);
    await h.drop();
    t.ok(eventRecord.isModified, 'Event was modified');
    t.is(eventRecord.startDate, new Date(2019, 9, 25, 10), 'Correct startDate');
    t.is(eventRecord.endDate, new Date(2019, 9, 25, 12), 'Correct endDate');
  });
  t.it('Should drag an inter-day event out of overflow to new date', async t => {
    await h.init(t);
    overflow = await h.overflowPopup('2019-10-15');
    const eventRecord = h.eventStore.getById(h.Event.Hackathon);
    t.is(eventRecord.startDate, new Date(2019, 9, 14), 'Correct startDate');
    t.is(eventRecord.endDate, new Date(2019, 9, 22), 'Correct endDate');
    [el, offset] = await overflow.hoverEvent(eventRecord.id);
    await h.drag(el, {
      offset
    });
    await h.hoverDate('2019-10-25');
    tentativeDates = h.getTentativeDates();
    t.expect(tentativeDates).toEqual([new Date(2019, 9, 25), new Date(2019, 9, 26), new Date(2019, 9, 27), new Date(2019, 9, 28), new Date(2019, 9, 29), new Date(2019, 9, 30), new Date(2019, 9, 31), [new Date(2019, 10, 1), 'other'], [new Date(2019, 9, 27), 'other'], [new Date(2019, 9, 28), 'other'], [new Date(2019, 9, 29), 'other'], [new Date(2019, 9, 30), 'other'], [new Date(2019, 9, 31), 'other'], new Date(2019, 10, 1)]);
    await h.drop();
    t.ok(eventRecord.isModified, 'Event was modified');
    t.is(eventRecord.startDate, new Date(2019, 9, 25), 'Correct startDate');
    t.is(eventRecord.endDate, new Date(2019, 10, 2), 'Correct endDate');
  });
  t.it('should abort drag operation on ESC keypress', async t => {
    await h.init(t);
    overflow = await h.overflowPopup('2019-10-15');
    [el, offset, eventRecord] = await overflow.hoverEvent(h.Event.TeamScrum);
    const {
      startDate,
      endDate
    } = eventRecord;
    await h.drag(el, {
      offset
    });
    await h.hoverDate('2019-10-25'); // Wait for focus to have left the overflow popup

    await t.waitFor(() => !h.calendar.modes.year.overflowPopup.containsFocus);
    t.ok(t.isDragging(), 'Dragging is active');
    tentativeDates = h.getTentativeDates();
    t.expect(tentativeDates).toEqual([new Date(2019, 9, 25)]);
    await t.type(null, '[ESC]');
    t.notOk(t.isDragging(), 'Dragging is not active');
    t.is(startDate, eventRecord.startDate, 'Same startDate');
    t.is(endDate, eventRecord.endDate, 'Same endDate');
    tentativeDates = h.getTentativeDates();
    t.expect(tentativeDates).toEqual([]);
  });
  t.describe('Page scrolled', t => {
    t.beforeEach(() => {
      t.enablePageScroll();
    });
    t.it('should drag when body is scrolled', async t => {
      await h.init(t);
      await h.moveCursorTo([300, 300]); // move the cursor away so we get the mouse entry

      overflow = await h.overflowPopup('2019-10-15');
      const eventRecord = h.eventStore.getById(h.Event.TeamScrum);
      t.is(eventRecord.startDate, new Date(2019, 9, 15, 10), 'Correct startDate');
      t.is(eventRecord.endDate, new Date(2019, 9, 15, 12), 'Correct endDate');
      [el, offset] = await overflow.hoverEvent(eventRecord.id);
      await h.drag(el, {
        offset
      });
      await h.hoverDate('2019-10-25');
      tentativeDates = h.getTentativeDates();
      t.expect(tentativeDates).toEqual([new Date(2019, 9, 25)]);
      await h.drop();
      t.ok(eventRecord.isModified, 'Event was modified');
      t.is(eventRecord.startDate, new Date(2019, 9, 25, 10), 'Correct startDate');
      t.is(eventRecord.endDate, new Date(2019, 9, 25, 12), 'Correct endDate');
    });
  });
});