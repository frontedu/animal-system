"use strict";

StartTest(t => {
  let h, tentativeDates;
  t.beforeEach(() => {
    var _h;

    (_h = h) === null || _h === void 0 ? void 0 : _h.destroy();
    h = tentativeDates = null;
    t.clearPageScroll();
    h = t.setupMonthViewDragHarness();
  });
  t.it('Should do nothing if disabled', async t => {
    await h.init(t);
    h.calendar.features.drag.disabled = true;
    let [el] = await h.hoverLeft(h.Event.Hackathon);
    t.is(h.isHovering(el), '', 'Hovering disabled');
    [el] = await h.hoverRight(h.Event.Hackathon);
    t.is(h.isHovering(el), '', 'Hovering disabled');
  });
  t.it('Should do nothing if event is readOnly', async t => {
    await h.init(t);
    const event = h.calendar.eventStore.getById(h.Event.Hackathon);
    event.readOnly = true;
    event.clearChanges();
    await t.dragBy({
      source: `[data-event-id="${h.Event.Hackathon}"]`,
      offset: [3, '50%'],
      delta: [-h.MONTH_PX_PER_DAY, 0]
    });
    t.notOk(event.isModified, 'Event not modified');
  });
  t.it('Should not allow dragging of arrow end-caps', async t => {
    await h.init(t);
    let [el] = await h.hoverLeft(h.Event.Hackathon, true);
    t.is(h.isHovering(el), 'hidden-left-edge', 'Gripper is hidden');
    [el] = await h.hoverRight(h.Event.Hackathon, false);
    t.is(h.isHovering(el), 'hidden-right-edge', 'Gripper is hidden');
  }); // startDate

  t.it('Should allow dragging startDate out of view and keep last position', async t => {
    await h.init(t);
    const eventRecord = h.eventStore.getById(h.Event.Hackathon);
    const [el, offset] = await h.hoverLeft(eventRecord.id);
    t.is(h.isHovering(el), 'left-edge', 'Hovering should be active');
    t.is(eventRecord.startDate, new Date(2019, 9, 14), 'Correct startDate before drag');
    t.is(eventRecord.endDate, new Date(2019, 9, 22), 'Correct endDate before drag');
    await h.drag(el, {
      offset,
      by: [-h.MONTH_PX_PER_DAY, 0]
    });
    t.is(eventRecord.startDate, new Date(2019, 9, 14), 'Same startDate during drag');
    tentativeDates = h.getTentativeDates();
    t.expect(tentativeDates).toEqual([[new Date(2019, 9, 13), new Date(2019, 9, 20), 'Hackathon 2019'], [new Date(2019, 9, 20), new Date(2019, 9, 22), 'Hackathon 2019']]);
    await h.moveCursorBy(-h.MONTH_PX_PER_DAY, 0);
    tentativeDates = h.getTentativeDates();
    t.expect(tentativeDates).toEqual([[new Date(2019, 9, 13), new Date(2019, 9, 20), 'Hackathon 2019'], [new Date(2019, 9, 20), new Date(2019, 9, 22), 'Hackathon 2019']]);
    await h.drop();
    t.is(h.isHovering(el), '', 'Hovering ended');
    t.is(eventRecord.startDate, new Date(2019, 9, 13), 'Correct startDate after drag');
    t.is(eventRecord.endDate, new Date(2019, 9, 22), 'Correct endDate after drag');
    tentativeDates = h.getTentativeDates();
    t.expect(tentativeDates).toEqual([]);
    t.is(eventRecord.startDate, new Date(2019, 9, 13), 'Same startDate after drag');
    t.is(eventRecord.endDate, new Date(2019, 9, 22), 'Same endDate after drag');
  });
  t.it('Should be able to drag startDate', async t => {
    await h.init(t);
    const eventRecord = h.eventStore.getById(h.Event.BeerTime); // The 768px height only allows 1 event per row when there is overflow, so work around that:

    eventRecord.startDate = new Date(2019, 9, 8);
    await t.waitForEvent(h.calendar.activeView, 'refresh');
    const [el, offset] = await h.hoverLeft(eventRecord.id);
    t.is(h.isHovering(el), 'left-edge', 'Hovering should be active');
    t.is(eventRecord.endDate, new Date(2019, 9, 9), 'Correct endDate before drag');
    await h.drag(el, {
      offset,
      by: [-2 * h.MONTH_PX_PER_DAY, 0]
    });
    const {
      tentativeEvent
    } = h;
    t.is(eventRecord.startDate, new Date(2019, 9, 8), 'Same startDate during drag');
    t.is(tentativeEvent.startDate, new Date(2019, 9, 6), 'Correct startDate during drag');
    tentativeDates = h.getTentativeDates();
    t.expect(tentativeDates).toEqual([[new Date(2019, 9, 6), new Date(2019, 9, 9), 'Relax and official arrival beer']]);
    await h.drop();
    t.is(h.isHovering(el), '', 'Hovering ended');
    t.is(eventRecord.startDate, new Date(2019, 9, 6), 'Correct startDate after drag');
    t.is(eventRecord.endDate, new Date(2019, 9, 9), 'Correct endDate after drag');
    tentativeDates = h.getTentativeDates();
    t.expect(tentativeDates).toEqual([]);
  });
  t.it('Should be able to drag startDate back and forward', async t => {
    await h.init(t);
    const eventRecord = h.eventStore.getById(h.Event.BeerTime); // The 768px height only allows 1 event per row when there is overflow, so work around that:

    eventRecord.startDate = new Date(2019, 9, 8);
    await t.waitForEvent(h.calendar.activeView, 'refresh');
    const [el, offset] = await h.hoverLeft(eventRecord.id);
    t.is(h.isHovering(el), 'left-edge', 'Hovering should be active');
    t.is(eventRecord.endDate, new Date(2019, 9, 9), 'Correct endDate before drag');
    await h.drag(el, {
      offset,
      by: [-2 * h.MONTH_PX_PER_DAY + h.EDGE_OFFSET, 0]
    });
    const {
      tentativeEvent
    } = h;
    t.is(eventRecord.startDate, new Date(2019, 9, 8), 'Same startDate during drag');
    t.is(tentativeEvent.startDate, new Date(2019, 9, 6), 'Correct startDate during drag');
    tentativeDates = h.getTentativeDates();
    t.expect(tentativeDates).toEqual([[new Date(2019, 9, 6), new Date(2019, 9, 9), 'Relax and official arrival beer']]);
    await h.moveCursorBy(h.MONTH_PX_PER_DAY, 0);
    t.is(eventRecord.startDate, new Date(2019, 9, 8), 'Same startDate during drag');
    t.is(tentativeEvent.startDate, new Date(2019, 9, 7), 'Correct startDate during drag');
    tentativeDates = h.getTentativeDates();
    t.expect(tentativeDates).toEqual([[new Date(2019, 9, 7), new Date(2019, 9, 9), 'Relax and official arrival beer']]);
    await h.drop();
    t.is(h.isHovering(el), '', 'Hovering ended');
    t.is(eventRecord.startDate, new Date(2019, 9, 7), 'Correct startDate after drag');
    t.is(eventRecord.endDate, new Date(2019, 9, 9), 'Correct endDate after drag');
    tentativeDates = h.getTentativeDates();
    t.expect(tentativeDates).toEqual([]);
  });
  t.it('Should be able to drag startDate up into prior week', async t => {
    await h.init(t);
    const eventRecord = h.eventStore.getById(h.Event.BeerTime); // The 768px height only allows 1 event per row when there is overflow, so work around that:

    eventRecord.startDate = new Date(2019, 9, 8);
    await t.waitForEvent(h.calendar.activeView, 'refresh');
    const [el, offset] = await h.hoverLeft(eventRecord.id);
    t.is(h.isHovering(el), 'left-edge', 'Hovering should be active');
    t.is(eventRecord.endDate, new Date(2019, 9, 9), 'Correct endDate before drag');
    await h.drag(el, {
      offset,
      by: [-1 * h.MONTH_PX_PER_DAY, 0]
    });
    const {
      tentativeEvent
    } = h;
    t.is(eventRecord.startDate, new Date(2019, 9, 8), 'Same startDate during drag');
    t.is(tentativeEvent.startDate, new Date(2019, 9, 7), 'Correct startDate during drag');
    tentativeDates = h.getTentativeDates();
    t.expect(tentativeDates).toEqual([[new Date(2019, 9, 7), new Date(2019, 9, 9), 'Relax and official arrival beer']]);
    await h.moveCursorBy(0, -75);
    t.is(eventRecord.startDate, new Date(2019, 9, 8), 'Same startDate during drag');
    t.is(tentativeEvent.startDate, new Date(2019, 8, 30), 'Correct startDate during drag');
    tentativeDates = h.getTentativeDates();
    t.expect(tentativeDates).toEqual([[new Date(2019, 8, 30), new Date(2019, 9, 6), 'Relax and official arrival beer'], [new Date(2019, 9, 6), new Date(2019, 9, 9), 'Relax and official arrival beer']]);
    await h.drop();
    t.is(h.isHovering(el), '', 'Hovering ended');
    t.is(eventRecord.startDate, new Date(2019, 8, 30), 'Correct startDate after drag');
    t.is(eventRecord.endDate, new Date(2019, 9, 9), 'Correct endDate after drag');
    tentativeDates = h.getTentativeDates();
    t.expect(tentativeDates).toEqual([]);
  });
  t.it('Should constrain drag of startDate to endDate', async t => {
    await h.init(t);
    const eventRecord = h.eventStore.getById(h.Event.BeerTime); // The 768px height only allows 1 event per row when there is overflow, so work around that:

    eventRecord.startDate = new Date(2019, 9, 8);
    await t.waitForEvent(h.calendar.activeView, 'refresh');
    const [el, offset] = await h.hoverLeft(eventRecord.id);
    t.is(h.isHovering(el), 'left-edge', 'Hovering should be active');
    t.is(eventRecord.endDate, new Date(2019, 9, 9), 'Correct endDate before drag');
    await h.drag(el, {
      offset,
      by: [-1 * h.MONTH_PX_PER_DAY, 0]
    });
    const {
      tentativeEvent
    } = h;
    t.is(eventRecord.startDate, new Date(2019, 9, 8), 'Same startDate during drag');
    t.is(tentativeEvent.startDate, new Date(2019, 9, 7), 'Correct startDate during drag');
    tentativeDates = h.getTentativeDates();
    t.expect(tentativeDates).toEqual([[new Date(2019, 9, 7), new Date(2019, 9, 9), 'Relax and official arrival beer']]);
    await h.moveCursorBy(0, 200);
    t.is(eventRecord.startDate, new Date(2019, 9, 8), 'Same startDate during drag');
    t.is(tentativeEvent.startDate, new Date(2019, 9, 8), 'Correct startDate during drag');
    tentativeDates = h.getTentativeDates();
    t.expect(tentativeDates).toEqual([[new Date(2019, 9, 8), new Date(2019, 9, 9), 'Relax and official arrival beer']]);
    await h.drop();
    t.is(h.isHovering(el), '', 'Hovering ended');
    t.is(eventRecord.startDate, new Date(2019, 9, 8), 'Correct startDate after drag');
    t.is(eventRecord.endDate, new Date(2019, 9, 9), 'Correct endDate after drag');
    tentativeDates = h.getTentativeDates();
    t.expect(tentativeDates).toEqual([]);
  }); // endDate

  t.it('Should drag endDate', async t => {
    await h.init(t);
    const eventRecord = h.eventStore.getById(h.Event.BeerTime); // The 768px height only allows 1 event per row when there is overflow, so work around that:

    eventRecord.startDate = new Date(2019, 9, 8);
    await t.waitForEvent(h.calendar.activeView, 'refresh');
    const [el, offset] = await h.hoverRight(eventRecord.id);
    t.is(h.isHovering(el), 'right-edge', 'Hovering should be active');
    t.is(eventRecord.endDate, new Date(2019, 9, 9), 'Correct endDate before drag');
    await h.drag(el, {
      offset,
      by: [2 * h.MONTH_PX_PER_DAY, 0]
    });
    const {
      tentativeEvent
    } = h;
    t.is(eventRecord.startDate, new Date(2019, 9, 8), 'Correct startDate during drag');
    t.is(eventRecord.endDate, new Date(2019, 9, 9), 'Same endDate during drag');
    t.is(tentativeEvent.endDate, new Date(2019, 9, 11), 'Correct endDate during drag');
    tentativeDates = h.getTentativeDates();
    t.expect(tentativeDates).toEqual([[new Date(2019, 9, 8), new Date(2019, 9, 11), 'Relax and official arrival beer']]);
    await h.drop();
    t.is(h.isHovering(el), '', 'Hovering ended');
    t.is(eventRecord.startDate, new Date(2019, 9, 8), 'Correct startDate after drag');
    t.is(eventRecord.endDate, new Date(2019, 9, 11), 'Correct endDate after drag');
    tentativeDates = h.getTentativeDates();
    t.expect(tentativeDates).toEqual([]);
  });
  t.it('Should drag endDate down into future weeks', async t => {
    await h.init(t);
    const eventRecord = h.eventStore.getById(h.Event.BeerTime); // The 768px height only allows 1 event per row when there is overflow, so work around that:

    eventRecord.startDate = new Date(2019, 9, 8);
    await t.waitForEvent(h.calendar.activeView, 'refresh');
    const [el, offset] = await h.hoverRight(eventRecord.id);
    t.is(h.isHovering(el), 'right-edge', 'Hovering should be active');
    t.is(eventRecord.endDate, new Date(2019, 9, 9), 'Correct endDate before drag');
    await h.drag(el, {
      offset,
      by: [2 * h.MONTH_PX_PER_DAY, 0]
    });
    const {
      tentativeEvent
    } = h;
    t.is(eventRecord.startDate, new Date(2019, 9, 8), 'Correct startDate during drag');
    t.is(eventRecord.endDate, new Date(2019, 9, 9), 'Same endDate during drag');
    t.is(tentativeEvent.endDate, new Date(2019, 9, 11), 'Correct endDate during drag');
    tentativeDates = h.getTentativeDates();
    t.expect(tentativeDates).toEqual([[new Date(2019, 9, 8), new Date(2019, 9, 11), 'Relax and official arrival beer']]);
    await h.moveCursorBy(0, h.MONTH_PX_PER_WEEK);
    t.is(eventRecord.startDate, new Date(2019, 9, 8), 'Correct startDate during drag');
    t.is(eventRecord.endDate, new Date(2019, 9, 9), 'Same endDate during drag');
    t.is(tentativeEvent.endDate, new Date(2019, 9, 18), 'Correct endDate during drag');
    tentativeDates = h.getTentativeDates();
    t.expect(tentativeDates).toEqual([[new Date(2019, 9, 8), new Date(2019, 9, 13), 'Relax and official arrival beer'], [new Date(2019, 9, 13), new Date(2019, 9, 18), 'Relax and official arrival beer']]);
    await h.drop();
    t.is(h.isHovering(el), '', 'Hovering ended');
    t.is(eventRecord.startDate, new Date(2019, 9, 8), 'Correct startDate after drag');
    t.is(eventRecord.endDate, new Date(2019, 9, 18), 'Correct endDate after drag');
    tentativeDates = h.getTentativeDates();
    t.expect(tentativeDates).toEqual([]);
  });
  t.it('Should constrain drag endDate to startDate', async t => {
    await h.init(t);
    const eventRecord = h.eventStore.getById(h.Event.BeerTime); // The 768px height only allows 1 event per row when there is overflow, so work around that:

    eventRecord.startDate = new Date(2019, 9, 8);
    await t.waitForEvent(h.calendar.activeView, 'refresh');
    const [el, offset] = await h.hoverRight(eventRecord.id);
    t.is(h.isHovering(el), 'right-edge', 'Hovering should be active');
    t.is(eventRecord.endDate, new Date(2019, 9, 9), 'Correct endDate before drag');
    await h.drag(el, {
      offset,
      by: [2 * h.MONTH_PX_PER_DAY, 0]
    });
    const {
      tentativeEvent
    } = h;
    t.is(eventRecord.startDate, new Date(2019, 9, 8), 'Correct startDate during drag');
    t.is(eventRecord.endDate, new Date(2019, 9, 9), 'Same endDate during drag');
    t.is(tentativeEvent.endDate, new Date(2019, 9, 11), 'Correct endDate during drag');
    tentativeDates = h.getTentativeDates();
    t.expect(tentativeDates).toEqual([[new Date(2019, 9, 8), new Date(2019, 9, 11), 'Relax and official arrival beer']]);
    await h.moveCursorBy(0, -75);
    t.is(eventRecord.startDate, new Date(2019, 9, 8), 'Correct startDate during drag');
    t.is(eventRecord.endDate, new Date(2019, 9, 9), 'Same endDate during drag');
    t.is(tentativeEvent.endDate, new Date(2019, 9, 9), 'Correct endDate during drag');
    tentativeDates = h.getTentativeDates();
    t.expect(tentativeDates).toEqual([[new Date(2019, 9, 8), new Date(2019, 9, 9), 'Relax and official arrival beer']]);
    await h.drop();
    t.is(h.isHovering(el), '', 'Hovering ended');
    t.is(eventRecord.startDate, new Date(2019, 9, 8), 'Correct startDate after drag');
    t.is(eventRecord.endDate, new Date(2019, 9, 9), 'Correct endDate after drag');
    tentativeDates = h.getTentativeDates();
    t.expect(tentativeDates).toEqual([]);
  });
  t.it('should abort drag operation on ESC keypress', async t => {
    await h.init(t);
    const eventRecord = h.eventStore.getById(h.Event.BeerTime); // The 768px height only allows 1 event per row when there is overflow, so work around that:

    eventRecord.startDate = new Date(2019, 9, 8);
    await t.waitForEvent(h.calendar.activeView, 'refresh');
    const {
      startDate,
      endDate
    } = eventRecord;
    const [el, offset] = await h.hoverLeft(eventRecord.id);
    await h.drag(el, {
      offset,
      by: [-1 * h.MONTH_PX_PER_DAY, 0]
    });
    t.ok(t.isDragging(), 'Dragging is active');
    await h.moveCursorBy(0, -75);
    tentativeDates = h.getTentativeDates();
    t.expect(tentativeDates).toEqual([[new Date(2019, 8, 30), new Date(2019, 9, 6), 'Relax and official arrival beer'], [new Date(2019, 9, 6), new Date(2019, 9, 9), 'Relax and official arrival beer']]);
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
        id: 1,
        startDate: '2021-06-02',
        endDate: '2021-06-03',
        name: 'Event 1'
      }, {
        id: 2,
        startDate: '2021-07-08',
        endDate: '2021-07-09',
        name: 'Event 2'
      }]
    });
    const {
      calendar
    } = h,
          overflowElement = calendar.viewContainer.element,
          event1 = calendar.eventStore.getById(1),
          event2 = calendar.eventStore.getById(2);
    let [source, sourceOffset] = await h.hoverRight(1); //#region Drag event to the bottom edge

    await t.dragTo({
      source,
      sourceOffset,
      target: overflowElement,
      targetOffset: ['50%', '100%-30'],
      dragOnly: true
    }); // Wait until element is scrolled to the bottom

    await t.waitFor(() => Math.abs(overflowElement.scrollTop + overflowElement.clientHeight - overflowElement.scrollHeight) <= 1);
    await t.mouseUp();
    t.is(event1.endDate, new Date(2021, 6, 8), 'End date is ok'); //#endregion

    [source, sourceOffset] = await h.hoverLeft(2);
    await t.dragTo({
      source,
      sourceOffset,
      target: overflowElement,
      targetOffset: ['50%', 30],
      dragOnly: true
    });
    await t.waitFor(() => overflowElement.scrollTop <= 1);
    const cell = await h.getCell('2021-06-02');
    await t.mouseUp(cell);
    t.is(event2.startDate, new Date(2021, 5, 2), 'Start date is ok');
  });
  t.describe('Page scrolled', t => {
    t.beforeEach(() => {
      t.enablePageScroll();
    });
    t.it('should drag when body is scrolled', async t => {
      await h.init(t);
      await h.moveCursorTo([300, 300]); // move the cursor away so we get the mouse entry

      const eventRecord = h.eventStore.getById(h.Event.BeerTime); // The 768px height only allows 1 event per row when there is overflow, so work around that:

      eventRecord.startDate = new Date(2019, 9, 8);
      await t.waitForEvent(h.calendar.activeView, 'refresh');
      const [el, offset] = await h.hoverLeft(eventRecord.id);
      t.is(h.isHovering(el), 'left-edge', 'Hovering should be active');
      t.is(eventRecord.endDate, new Date(2019, 9, 9), 'Correct endDate before drag');
      await h.drag(el, {
        offset,
        by: [-2 * h.MONTH_PX_PER_DAY, 0]
      });
      const {
        tentativeEvent
      } = h;
      t.is(eventRecord.startDate, new Date(2019, 9, 8), 'Same startDate during drag');
      t.is(tentativeEvent.startDate, new Date(2019, 9, 6), 'Correct startDate during drag');
      tentativeDates = h.getTentativeDates();
      t.expect(tentativeDates).toEqual([[new Date(2019, 9, 6), new Date(2019, 9, 9), 'Relax and official arrival beer']]);
      await h.drop();
      t.is(h.isHovering(el), '', 'Hovering ended');
      t.is(eventRecord.startDate, new Date(2019, 9, 6), 'Correct startDate after drag');
      t.is(eventRecord.endDate, new Date(2019, 9, 9), 'Correct endDate after drag');
      tentativeDates = h.getTentativeDates();
      t.expect(tentativeDates).toEqual([]);
    });
  });
});