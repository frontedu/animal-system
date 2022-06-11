"use strict";

StartTest(t => {
  let el, h, eventRecord, offset, overflow, tentativeDates;
  t.beforeEach(t => {
    var _h;

    (_h = h) === null || _h === void 0 ? void 0 : _h.destroy();
    el = h = null;
    t.clearPageScroll();
  });
  t.describe('Month View', t => {
    t.beforeEach(t => {
      h = t.setupMonthViewDragHarness();
    });
    t.it('Should do nothing if disabled', async t => {
      await h.init(t);
      h.calendar.features.drag.disabled = true;
      const eventRecord = h.eventStore.getById(h.Event.Hackathon);
      [el, offset] = await h.hoverEvent(eventRecord.id);
      await h.drag(el, {
        offset: [2.5 * h.MONTH_PX_PER_DAY, 10],
        by: [0, -h.MONTH_PX_PER_WEEK]
      });
      t.notOk(t.isDragging(), 'Drag is not active');
      await h.drop();
      t.notOk(eventRecord.isModified, 'Record was not moved');
    });
    t.it('Should do nothing if event is readOnly', async t => {
      await h.init(t);
      const event = h.calendar.eventStore.getById(h.Event.Hackathon);
      event.readOnly = true;
      event.clearChanges();
      await t.dragBy({
        source: `[data-event-id="${h.Event.Hackathon}"]`,
        delta: [-h.MONTH_PX_PER_DAY, 0]
      });
      t.notOk(event.isModified, 'Event not modified');
    });
    t.it('should abort drag operation on ESC keypress', async t => {
      await h.init(t);
      [el, offset, eventRecord] = await h.hoverEvent(h.Event.Hackathon);
      const {
        startDate,
        endDate
      } = eventRecord;
      await h.drag(el, {
        offset: [2.5 * h.MONTH_PX_PER_DAY, 10],
        by: [0, -h.MONTH_PX_PER_WEEK]
      });
      t.ok(t.isDragging(), 'Drag is active');
      tentativeDates = h.getTentativeDates();
      t.expect(tentativeDates).toEqual([[new Date(2019, 9, 7), new Date(2019, 9, 13), h.Text.Hackathon], [new Date(2019, 9, 13), new Date(2019, 9, 15), h.Text.Hackathon]]);
      await t.type(null, '[ESC]');
      t.notOk(t.isDragging(), 'Dragging is not active');
      t.is(startDate, eventRecord.startDate, 'Same startDate');
      t.is(endDate, eventRecord.endDate, 'Same endDate');
      tentativeDates = h.getTentativeDates();
      t.expect(tentativeDates).toEqual([]);
    });
    t.it('Should scroll the view when dragging close to the edge', async t => {
      await h.init(t, {
        mode: 'month',
        date: new Date(2021, 5, 2),
        height: 300,
        events: [{
          startDate: '2021-06-02',
          endDate: '2021-06-03',
          name: 'Event 1'
        }]
      });
      const {
        calendar
      } = h,
            overflowElement = calendar.viewContainer.element,
            event = calendar.eventStore.last; //#region Drag event to the bottom edge

      await t.dragTo({
        source: '.b-cal-event',
        target: overflowElement,
        targetOffset: ['50%', '100%-30'],
        dragOnly: true
      }); // Wait until element is scrolled to the bottom

      await t.waitFor(() => Math.abs(overflowElement.scrollTop + overflowElement.clientHeight - overflowElement.scrollHeight) <= 1);
      await t.mouseUp();
      t.is(event.startDate, new Date(2021, 6, 7), 'Start date is ok');
      t.is(event.endDate, new Date(2021, 6, 8), 'End date is ok'); //#endregion
      //region Drag event to the top edge

      await t.dragTo({
        source: '.b-cal-event',
        target: overflowElement,
        targetOffset: ['50%', 30],
        dragOnly: true
      }); // Wait until element is scrolled to the bottom

      await t.waitFor(() => overflowElement.scrollTop <= 1);
      const cell = await h.getCell('2021-06-02');
      await t.mouseUp(cell);
      t.is(event.startDate, new Date(2021, 5, 2), 'Start date is ok');
      t.is(event.endDate, new Date(2021, 5, 3), 'End date is ok'); //endregion
    });
    t.describe('One axis drag', t => {
      t.it('Should move multi-day event up one week', async t => {
        await h.init(t);
        const eventRecord = h.eventStore.getById(h.Event.Hackathon);
        t.is(eventRecord.startDate, new Date(2019, 9, 14), 'Correct startDate');
        t.is(eventRecord.endDate, new Date(2019, 9, 22), 'Correct endDate');
        [el, offset] = await h.hoverEvent(eventRecord.id);
        await h.drag(el, {
          offset: [2.5 * h.MONTH_PX_PER_DAY, 10],
          by: [0, -h.MONTH_PX_PER_WEEK]
        });
        t.ok(t.isDragging(), 'Drag is active');
        tentativeDates = h.getTentativeDates();
        t.expect(tentativeDates).toEqual([[new Date(2019, 9, 7), new Date(2019, 9, 13), h.Text.Hackathon], [new Date(2019, 9, 13), new Date(2019, 9, 15), h.Text.Hackathon]]);
        await h.drop();
        t.ok(eventRecord.isModified, 'Record was moved');
        t.is(eventRecord.startDate, new Date(2019, 9, 7), 'Correct startDate');
        t.is(eventRecord.endDate, new Date(2019, 9, 15), 'Correct endDate');
      });
      t.it('Should move multi-day event down one week', async t => {
        await h.init(t);
        const eventRecord = h.eventStore.getById(h.Event.Hackathon);
        t.is(eventRecord.startDate, new Date(2019, 9, 14), 'Correct startDate');
        t.is(eventRecord.endDate, new Date(2019, 9, 22), 'Correct endDate');
        [el, offset] = await h.hoverEvent(eventRecord.id);
        await h.drag(el, {
          offset: [2.5 * h.MONTH_PX_PER_DAY, 10],
          by: [0, h.MONTH_PX_PER_WEEK]
        });
        t.ok(t.isDragging(), 'Drag is active');
        tentativeDates = h.getTentativeDates();
        t.expect(tentativeDates).toEqual([[new Date(2019, 9, 21), new Date(2019, 9, 27), h.Text.Hackathon], [new Date(2019, 9, 27), new Date(2019, 9, 29), h.Text.Hackathon]]);
        await h.drop();
        t.ok(eventRecord.isModified, 'Record was moved');
        t.is(eventRecord.startDate, new Date(2019, 9, 21), 'Correct startDate');
        t.is(eventRecord.endDate, new Date(2019, 9, 29), 'Correct endDate');
      });
      t.it('Should move events horizontally on an expanded row and then above and below', async t => {
        await h.init(t, {
          features: {
            weekExpander: true
          }
        });
        h.calendar.modes.month.refresh();
        let eventRecord = h.eventStore.getById(h.Event.Dinner3);
        t.is(eventRecord.startDate, new Date(2019, 9, 16, 19), 'Correct startDate');
        await t.click('[data-week="2019,42"] .b-week-toggle-tool');
        [el, offset] = await h.hoverEvent(eventRecord.id);
        await t.mouseDown();
        await t.moveCursorBy([h.MONTH_PX_PER_DAY, 0]);
        t.ok(t.isDragging(), 'Drag is active');
        tentativeDates = h.getTentativeDates(
        /*includeTop=*/
        true);
        t.expect(tentativeDates).toEqual([// retains top of event when dragging along origin week
        [new Date(2019, 9, 17), new Date(2019, 9, 18), h.Text.Dinner3, 158]]);
        await t.moveCursorBy([0, -1 * h.MONTH_PX_PER_WEEK]);
        t.ok(t.isDragging(), 'Drag is active');
        tentativeDates = h.getTentativeDates(
        /*includeTop=*/
        true);
        t.expect(tentativeDates).toEqual([// retains top of event while still dragging inside origin week
        [new Date(2019, 9, 17), new Date(2019, 9, 18), h.Text.Dinner3, 158]]);
        await t.moveCursorBy([0, -1 * h.MONTH_PX_PER_WEEK]);
        t.ok(t.isDragging(), 'Drag is active');
        tentativeDates = h.getTentativeDates(
        /*includeTop=*/
        true);
        t.expect(tentativeDates).toEqual([// does not retain top of event on other weeks:
        [new Date(2019, 9, 10), new Date(2019, 9, 11), h.Text.Dinner3, 0]]);
        await h.drop();
        t.ok(eventRecord.isModified, 'Record was moved');
        t.is(eventRecord.startDate, new Date(2019, 9, 10, 19), 'Correct startDate');
        t.is(eventRecord.endDate, new Date(2019, 9, 10, 20), 'Correct endDate'); //-------------------------------------------------------------------

        eventRecord = h.eventStore.getById(h.Event.Dinner2);
        t.is(eventRecord.startDate, new Date(2019, 9, 15, 19), 'Correct startDate');
        [el, offset] = await h.hoverEvent(eventRecord.id);
        await t.mouseDown();
        await t.moveCursorBy([h.MONTH_PX_PER_DAY, 0]);
        t.ok(t.isDragging(), 'Drag is active');
        tentativeDates = h.getTentativeDates(
        /*includeTop=*/
        true);
        t.expect(tentativeDates).toEqual([// retains top of event when dragging along origin week
        [new Date(2019, 9, 16), new Date(2019, 9, 17), h.Text.Dinner2, 158]]);
        await t.moveCursorBy([0, h.MONTH_PX_PER_WEEK]);
        t.ok(t.isDragging(), 'Drag is active');
        tentativeDates = h.getTentativeDates(
        /*includeTop=*/
        true);
        t.expect(tentativeDates).toEqual([// does not retain top of event on other weeks:
        [new Date(2019, 9, 23), new Date(2019, 9, 24), h.Text.Dinner2, 0]]);
        await h.drop();
        t.ok(eventRecord.isModified, 'Record was moved');
        t.is(eventRecord.startDate, new Date(2019, 9, 23, 19), 'Correct startDate');
        t.is(eventRecord.endDate, new Date(2019, 9, 23, 20), 'Correct endDate');
      });
      t.it('Should move multi-day event right one day', async t => {
        await h.init(t);
        const eventRecord = h.eventStore.getById(h.Event.Hackathon);
        t.is(eventRecord.startDate, new Date(2019, 9, 14), 'Correct startDate');
        t.is(eventRecord.endDate, new Date(2019, 9, 22), 'Correct endDate');
        [el, offset] = await h.hoverEvent(eventRecord.id);
        await h.drag(el, {
          offset: [2.5 * h.MONTH_PX_PER_DAY, 10],
          by: [h.MONTH_PX_PER_DAY, 0]
        });
        t.ok(t.isDragging(), 'Drag is active');
        tentativeDates = h.getTentativeDates();
        t.expect(tentativeDates).toEqual([[new Date(2019, 9, 15), new Date(2019, 9, 20), h.Text.Hackathon], [new Date(2019, 9, 20), new Date(2019, 9, 23), h.Text.Hackathon]]);
        await h.drop();
        t.ok(eventRecord.isModified, 'Record was moved');
        t.is(eventRecord.startDate, new Date(2019, 9, 15), 'Correct startDate');
        t.is(eventRecord.endDate, new Date(2019, 9, 23), 'Correct endDate');
      });
      t.it('Should move multi-day event left one day', async t => {
        await h.init(t);
        const eventRecord = h.eventStore.getById(h.Event.Hackathon);
        t.is(eventRecord.startDate, new Date(2019, 9, 14), 'Correct startDate');
        t.is(eventRecord.endDate, new Date(2019, 9, 22), 'Correct endDate');
        [el, offset] = await h.hoverEvent(eventRecord.id);
        await h.drag(el, {
          offset: [2.5 * h.MONTH_PX_PER_DAY, 10],
          by: [-h.MONTH_PX_PER_DAY, 0]
        });
        t.ok(t.isDragging(), 'Drag is active');
        tentativeDates = h.getTentativeDates();
        t.expect(tentativeDates).toEqual([[new Date(2019, 9, 13), new Date(2019, 9, 20), h.Text.Hackathon], [new Date(2019, 9, 20), new Date(2019, 9, 21), h.Text.Hackathon]]);
        await h.drop();
        t.ok(eventRecord.isModified, 'Record was moved');
        t.is(eventRecord.startDate, new Date(2019, 9, 13), 'Correct startDate');
        t.is(eventRecord.endDate, new Date(2019, 9, 21), 'Correct endDate');
      });
    });
    t.describe('Two axis drag', t => {
      t.it('Should move multi-day event up one week and left one day', async t => {
        await h.init(t);
        const eventRecord = h.eventStore.getById(h.Event.Hackathon);
        t.is(eventRecord.startDate, new Date(2019, 9, 14), 'Correct startDate');
        t.is(eventRecord.endDate, new Date(2019, 9, 22), 'Correct endDate');
        [el, offset] = await h.hoverEvent(eventRecord.id);
        await h.drag(el, {
          offset: [2.5 * h.MONTH_PX_PER_DAY, 10],
          by: [-h.MONTH_PX_PER_DAY, -h.MONTH_PX_PER_WEEK]
        });
        t.ok(t.isDragging(), 'Drag is active');
        tentativeDates = h.getTentativeDates();
        t.expect(tentativeDates).toEqual([[new Date(2019, 9, 6), new Date(2019, 9, 13), h.Text.Hackathon], [new Date(2019, 9, 13), new Date(2019, 9, 14), h.Text.Hackathon]]);
        await h.drop();
        t.ok(eventRecord.isModified, 'Record was moved');
        t.is(eventRecord.startDate, new Date(2019, 9, 6), 'Correct startDate');
        t.is(eventRecord.endDate, new Date(2019, 9, 14), 'Correct endDate');
      });
      t.it('Should move multi-day event up one week and right one day', async t => {
        await h.init(t);
        const eventRecord = h.eventStore.getById(h.Event.Hackathon);
        t.is(eventRecord.startDate, new Date(2019, 9, 14), 'Correct startDate');
        t.is(eventRecord.endDate, new Date(2019, 9, 22), 'Correct endDate');
        [el, offset] = await h.hoverEvent(eventRecord.id);
        await h.drag(el, {
          offset: [2.5 * h.MONTH_PX_PER_DAY, 10],
          by: [h.MONTH_PX_PER_DAY, -h.MONTH_PX_PER_WEEK]
        });
        t.ok(t.isDragging(), 'Drag is active');
        tentativeDates = h.getTentativeDates();
        t.expect(tentativeDates).toEqual([[new Date(2019, 9, 8), new Date(2019, 9, 13), h.Text.Hackathon], [new Date(2019, 9, 13), new Date(2019, 9, 16), h.Text.Hackathon]]);
        await h.drop();
        t.ok(eventRecord.isModified, 'Record was moved');
        t.is(eventRecord.startDate, new Date(2019, 9, 8), 'Correct startDate');
        t.is(eventRecord.endDate, new Date(2019, 9, 16), 'Correct endDate');
      });
      t.it('Should move multi-day event down one week and left one day', async t => {
        await h.init(t);
        const eventRecord = h.eventStore.getById(h.Event.Hackathon);
        t.is(eventRecord.startDate, new Date(2019, 9, 14), 'Correct startDate');
        t.is(eventRecord.endDate, new Date(2019, 9, 22), 'Correct endDate');
        [el, offset] = await h.hoverEvent(eventRecord.id);
        await h.drag(el, {
          offset: [2.5 * h.MONTH_PX_PER_DAY, 10],
          by: [-h.MONTH_PX_PER_DAY, h.MONTH_PX_PER_WEEK]
        });
        t.ok(t.isDragging(), 'Drag is active');
        tentativeDates = h.getTentativeDates();
        t.expect(tentativeDates).toEqual([[new Date(2019, 9, 20), new Date(2019, 9, 27), h.Text.Hackathon], [new Date(2019, 9, 27), new Date(2019, 9, 28), h.Text.Hackathon]]);
        await h.drop();
        t.ok(eventRecord.isModified, 'Record was moved');
        t.is(eventRecord.startDate, new Date(2019, 9, 20), 'Correct startDate');
        t.is(eventRecord.endDate, new Date(2019, 9, 28), 'Correct endDate');
      });
      t.it('Should move multi-day event down one week and right one day', async t => {
        await h.init(t);
        const eventRecord = h.eventStore.getById(h.Event.Hackathon);
        t.is(eventRecord.startDate, new Date(2019, 9, 14), 'Correct startDate');
        t.is(eventRecord.endDate, new Date(2019, 9, 22), 'Correct endDate');
        [el, offset] = await h.hoverEvent(eventRecord.id);
        await h.drag(el, {
          offset: [2.5 * h.MONTH_PX_PER_DAY, 10],
          by: [h.MONTH_PX_PER_DAY, h.MONTH_PX_PER_WEEK]
        });
        t.ok(t.isDragging(), 'Drag is active');
        tentativeDates = h.getTentativeDates();
        t.expect(tentativeDates).toEqual([[new Date(2019, 9, 22), new Date(2019, 9, 27), h.Text.Hackathon], [new Date(2019, 9, 27), new Date(2019, 9, 30), h.Text.Hackathon]]);
        await h.drop();
        t.ok(eventRecord.isModified, 'Record was moved');
        t.is(eventRecord.startDate, new Date(2019, 9, 22), 'Correct startDate');
        t.is(eventRecord.endDate, new Date(2019, 9, 30), 'Correct endDate');
      });
    });
    t.describe('Page scrolled', t => {
      t.beforeEach(() => {
        t.enablePageScroll();
      });
      t.it('should drag when body is scrolled', async t => {
        await h.init(t);
        await h.moveCursorTo([300, 300]); // move the cursor away so we get the mouse entry

        const eventRecord = h.eventStore.getById(h.Event.Hackathon);
        t.is(eventRecord.startDate, new Date(2019, 9, 14), 'Correct startDate');
        t.is(eventRecord.endDate, new Date(2019, 9, 22), 'Correct endDate');
        [el, offset] = await h.hoverEvent(eventRecord.id);
        await h.drag(el, {
          offset: [2.5 * h.MONTH_PX_PER_DAY, 10],
          by: [0, h.MONTH_PX_PER_WEEK]
        });
        t.ok(t.isDragging(), 'Drag is active');
        tentativeDates = h.getTentativeDates();
        t.expect(tentativeDates).toEqual([[new Date(2019, 9, 21), new Date(2019, 9, 27), h.Text.Hackathon], [new Date(2019, 9, 27), new Date(2019, 9, 29), h.Text.Hackathon]]);
        await h.drop();
        t.ok(eventRecord.isModified, 'Record was moved');
        t.is(eventRecord.startDate, new Date(2019, 9, 21), 'Correct startDate');
        t.is(eventRecord.endDate, new Date(2019, 9, 29), 'Correct endDate');
      });
    });
    t.describe('Hidden nonworking days', t => {
      t.it('Should move single-day event up one week', async t => {
        await h.init(t, {
          modes: {
            month: {
              hideNonWorkingDays: true
            }
          }
        });
        const eventRecord = h.eventStore.getById(h.Event.BeerTime);
        t.is(eventRecord.startDate, new Date(2019, 9, 14), 'Correct startDate');
        t.is(eventRecord.endDate, new Date(2019, 9, 15), 'Correct endDate');
        [el, offset] = await h.hoverEvent(eventRecord.id);
        await h.drag(el, {
          by: [0, -h.MONTH_PX_PER_WEEK]
        });
        t.ok(t.isDragging(), 'Drag is active');
        tentativeDates = h.getTentativeDates();
        t.expect(tentativeDates).toEqual([[new Date(2019, 9, 7), new Date(2019, 9, 8), h.Text.BeerTime]]);
        await h.drop();
        t.ok(eventRecord.isModified, 'Record was moved');
        t.is(eventRecord.startDate, new Date(2019, 9, 7), 'Correct startDate');
        t.is(eventRecord.endDate, new Date(2019, 9, 8), 'Correct endDate');
      });
      t.it('Should move single-day event up one week and then to the end of the working week', async t => {
        await h.init(t, {
          modes: {
            month: {
              hideNonWorkingDays: true
            }
          }
        });
        const eventRecord = h.eventStore.getById(h.Event.BeerTime),
              cellWidth = h.calendar.activeView.element.querySelector('.b-calendar-cell:not(.b-nonworking-day)').getBoundingClientRect().width;
        t.is(eventRecord.startDate, new Date(2019, 9, 14), 'Correct startDate');
        t.is(eventRecord.endDate, new Date(2019, 9, 15), 'Correct endDate');
        [el, offset] = await h.hoverEvent(eventRecord.id);
        await h.drag(el, {
          by: [cellWidth * 4, -h.MONTH_PX_PER_WEEK]
        });
        t.ok(t.isDragging(), 'Drag is active');
        tentativeDates = h.getTentativeDates();
        t.expect(tentativeDates).toEqual([[new Date(2019, 9, 11), new Date(2019, 9, 12), h.Text.BeerTime]]);
        await h.drop();
        t.ok(eventRecord.isModified, 'Record was moved');
        t.is(eventRecord.startDate, new Date(2019, 9, 11), 'Correct startDate');
        t.is(eventRecord.endDate, new Date(2019, 9, 12), 'Correct endDate');
      });
    });
  });
  t.describe('Month View Overflow', t => {
    t.beforeEach(t => {
      h = t.setupMonthViewDragHarness();
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
      await h.hoverDate('2019-10-11');
      tentativeDates = h.getTentativeDates();
      t.expect(tentativeDates).toEqual([]);
      await h.drop();
      t.notOk(eventRecord.isModified, 'Event not modified');
      t.is(eventRecord.startDate, new Date(2019, 9, 15, 10), 'Correct startDate');
      t.is(eventRecord.endDate, new Date(2019, 9, 15, 12), 'Correct endDate');
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
      await h.hoverDate('2019-10-11');
      t.ok(t.isDragging(), 'Dragging is active');
      tentativeDates = h.getTentativeDates();
      t.expect(tentativeDates).toEqual([[new Date(2019, 9, 11), new Date(2019, 9, 12), h.Text.TeamScrum]]);
      await t.type(null, '[ESC]');
      t.notOk(t.isDragging(), 'Dragging is not active');
      t.is(startDate, eventRecord.startDate, 'Same startDate');
      t.is(endDate, eventRecord.endDate, 'Same endDate');
      tentativeDates = h.getTentativeDates();
      t.expect(tentativeDates).toEqual([]);
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
      await h.hoverDate('2019-10-11');
      tentativeDates = h.getTentativeDates();
      t.expect(tentativeDates).toEqual([[new Date(2019, 9, 11), new Date(2019, 9, 12), h.Text.TeamScrum]]);
      await h.drop();
      t.ok(eventRecord.isModified, 'Event was modified');
      t.is(eventRecord.startDate, new Date(2019, 9, 11, 10), 'Correct startDate');
      t.is(eventRecord.endDate, new Date(2019, 9, 11, 12), 'Correct endDate');
    });
    t.it('Should drag an inter-day event out of overflow to new date', async t => {
      await h.init(t);
      overflow = await h.overflowPopup('2019-10-14');
      const eventRecord = h.eventStore.getById(h.Event.BeerTime);
      t.is(eventRecord.startDate, new Date(2019, 9, 14), 'Correct startDate');
      t.is(eventRecord.endDate, new Date(2019, 9, 15), 'Correct endDate');
      eventRecord.endDate = new Date(2019, 9, 16);
      [el, offset] = await overflow.hoverEvent(eventRecord.id);
      await h.drag(el, {
        offset
      });
      await h.hoverDate('2019-10-11');
      tentativeDates = h.getTentativeDates();
      t.expect(tentativeDates).toEqual([[new Date(2019, 9, 11), new Date(2019, 9, 13), h.Text.BeerTime]]);
      await h.drop();
      t.ok(eventRecord.isModified, 'Event was modified');
      t.is(eventRecord.startDate, new Date(2019, 9, 11), 'Correct startDate');
      t.is(eventRecord.endDate, new Date(2019, 9, 13), 'Correct endDate');
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
        await h.hoverDate('2019-10-11');
        tentativeDates = h.getTentativeDates();
        t.expect(tentativeDates).toEqual([[new Date(2019, 9, 11), new Date(2019, 9, 12), h.Text.TeamScrum]]);
        await h.drop();
        t.ok(eventRecord.isModified, 'Event was modified');
        t.is(eventRecord.startDate, new Date(2019, 9, 11, 10), 'Correct startDate');
        t.is(eventRecord.endDate, new Date(2019, 9, 11, 12), 'Correct endDate');
      });
    });
  });
});