"use strict";

StartTest(t => {
  let h, tentativeDates;
  t.beforeEach(() => {
    var _h;

    (_h = h) === null || _h === void 0 ? void 0 : _h.destroy();
    h = tentativeDates = null;
    t.clearPageScroll();
  });
  t.describe('All Day', t => {
    t.beforeEach(t => {
      h = t.setupDayViewAllDayDragHarness();
    });
    t.it('Should do nothing if disabled', async t => {
      await h.init(t);
      h.calendar.features.drag.disabled = true;
      let [el] = await h.hoverLeft(h.Event.BeerTime);
      t.is(h.isHovering(el), '', 'Hovering should be disabled');
      [el] = await h.hoverRight(h.Event.BeerTime);
      t.is(h.isHovering(el), '', 'Hovering should be disabled');
    });
    t.it('Should not allow drag change of startDate', async t => {
      await h.init(t);
      const [el] = await h.hoverLeft(h.Event.BeerTime);
      t.is(h.isHovering(el), '', 'Hovering should be disabled');
    });
    t.it('Should not allow drag change of endDate', async t => {
      await h.init(t);
      const [el] = await h.hoverRight(h.Event.BeerTime);
      t.is(h.isHovering(el), '', 'Hovering should be disabled');
    });
  });
  t.describe('Day Detail', t => {
    t.beforeEach(t => {
      h = t.setupDayViewDragHarness();
    });
    t.it('Should do nothing if disabled', async t => {
      await h.init(t);
      h.calendar.features.drag.disabled = true;
      let [el] = await h.hoverTop(h.Event.CheckInHotel);
      t.is(h.isHovering(el), '', 'Hovering should be disabled');
      [el] = await h.hoverBottom(h.Event.CheckInHotel);
      t.is(h.isHovering(el), '', 'Hovering should be disabled');
    });
    t.it('Should do nothing if event is readOnly', async t => {
      await h.init(t);
      const event = h.calendar.eventStore.getById(h.Event.CheckInHotel);
      event.readOnly = true;
      event.clearChanges();
      await t.dragBy({
        source: '[data-event-id="2"]',
        offset: ['50%', 3],
        delta: [0, -100]
      });
      t.notOk(event.isModified, 'Event not modified');
    });
    t.it('Should do nothing if validator vetoes', async t => {
      await h.init(t, {
        features: {
          drag: {
            validateResizeFn: 'up.validateResize'
          }
        },
        validateResize: () => false
      });
      const eventRecord = h.eventStore.getById(h.Event.CheckInHotel),
            startDate = new Date(eventRecord.startDate);
      const [el, offset] = await h.hoverTop(eventRecord.id);
      t.is(h.isHovering(el), 'top-edge', 'Hovering should be active');
      t.is(eventRecord.startDate, new Date(2019, 9, 14, 14), 'Correct startDate before drag');
      await h.drag(el, {
        offset,
        by: [0, -2 * h.DAY_PX_PER_HOUR - h.EDGE_OFFSET]
      });
      await h.drop();
      t.is(eventRecord.startDate, startDate, 'Event has not been resized');
    });
    t.it('Should be able to drag startDate up and down by 2 hours', async t => {
      await h.init(t);
      const eventRecord = h.eventStore.getById(h.Event.CheckInHotel);
      const [el, offset] = await h.hoverTop(eventRecord.id);
      t.is(h.isHovering(el), 'top-edge', 'Hovering should be active');
      t.is(eventRecord.startDate, new Date(2019, 9, 14, 14), 'Correct startDate before drag');
      await h.drag(el, {
        offset,
        by: [0, 2 * h.DAY_PX_PER_HOUR - h.EDGE_OFFSET]
      });
      const {
        tentativeEvent
      } = h;
      t.is(eventRecord.startDate, new Date(2019, 9, 14, 14), 'Same startDate during drag');
      t.is(tentativeEvent.startDate, new Date(2019, 9, 14, 16), 'Correct startDate during drag');
      tentativeDates = h.getTentativeDates();
      t.expect(tentativeDates).toEqual([[new Date(2019, 9, 14, 16), new Date(2019, 9, 14, 18), `4 PM${h.Text.CheckInHotel}6 PM`]]);
      await h.moveCursorBy(0, -4 * h.DAY_PX_PER_HOUR);
      t.is(eventRecord.startDate, new Date(2019, 9, 14, 14), 'Same startDate during drag');
      t.is(tentativeEvent.startDate, new Date(2019, 9, 14, 12), 'Correct startDate at drag end');
      tentativeDates = h.getTentativeDates();
      t.expect(tentativeDates).toEqual([[new Date(2019, 9, 14, 12), new Date(2019, 9, 14, 18), `12 PM${h.Text.CheckInHotel}6 PM`]]);
      await h.drop();
      t.is(eventRecord.startDate, new Date(2019, 9, 14, 12), 'Correct startDate after drag');
      tentativeDates = h.getTentativeDates();
      t.expect(tentativeDates).toEqual([]);
      t.is(h.isHovering(el), '', 'Hovering ended');
    });
    t.it('Should be able to drag startDate down and up by 2 hours', async t => {
      await h.init(t);
      const eventRecord = h.eventStore.getById(h.Event.CheckInHotel);
      const [el, offset] = await h.hoverTop(eventRecord.id);
      t.is(h.isHovering(el), 'top-edge', 'Hovering should be active');
      t.is(eventRecord.startDate, new Date(2019, 9, 14, 14), 'Correct startDate before drag');
      await h.drag(el, {
        offset,
        by: [0, -2 * h.DAY_PX_PER_HOUR - h.EDGE_OFFSET]
      });
      const {
        tentativeEvent
      } = h;
      t.is(eventRecord.startDate, new Date(2019, 9, 14, 14), 'Same startDate during drag');
      t.is(tentativeEvent.startDate, new Date(2019, 9, 14, 12), 'Correct startDate during drag');
      tentativeDates = h.getTentativeDates();
      t.expect(tentativeDates).toEqual([[new Date(2019, 9, 14, 12), new Date(2019, 9, 14, 18), `12 PM${h.Text.CheckInHotel}6 PM`]]);
      await h.moveCursorBy(0, 4 * h.DAY_PX_PER_HOUR);
      t.is(eventRecord.startDate, new Date(2019, 9, 14, 14), 'Same startDate during drag');
      t.is(tentativeEvent.startDate, new Date(2019, 9, 14, 16), 'Correct startDate at drag end');
      tentativeDates = h.getTentativeDates();
      t.expect(tentativeDates).toEqual([[new Date(2019, 9, 14, 16), new Date(2019, 9, 14, 18), `4 PM${h.Text.CheckInHotel}6 PM`]]);
      await h.drop();
      t.is(eventRecord.startDate, new Date(2019, 9, 14, 16), 'Correct startDate after drag');
      tentativeDates = h.getTentativeDates();
      t.expect(tentativeDates).toEqual([]);
      t.is(h.isHovering(el), '', 'Hovering ended');
    });
    t.it('Should limit drag startDate to endDate', async t => {
      await h.init(t);
      const eventRecord = h.eventStore.getById(h.Event.CheckInHotel);
      const [el, offset] = await h.hoverTop(eventRecord.id);
      t.is(h.isHovering(el), 'top-edge', 'Hovering should be active');
      t.is(eventRecord.startDate, new Date(2019, 9, 14, 14), 'Correct startDate before drag');
      t.is(eventRecord.endDate, new Date(2019, 9, 14, 18), 'Correct endDate before drag');
      await h.drag(el, {
        offset,
        by: [0, 3 * h.DAY_PX_PER_HOUR - h.EDGE_OFFSET]
      });
      const {
        tentativeEvent
      } = h;
      t.is(eventRecord.startDate, new Date(2019, 9, 14, 14), 'Same startDate during drag');
      t.is(tentativeEvent.startDate, new Date(2019, 9, 14, 17), 'Correct startDate during drag');
      tentativeDates = h.getTentativeDates();
      t.expect(tentativeDates).toEqual([[new Date(2019, 9, 14, 17), new Date(2019, 9, 14, 18), `5 PM${h.Text.CheckInHotel}6 PM`]]); // Important to stay inside the drag proxy for Siesta reasons

      await h.moveCursorBy(0, h.DAY_PX_PER_HOUR - 2 * h.EDGE_OFFSET);
      t.is(eventRecord.startDate, new Date(2019, 9, 14, 14), 'Same startDate during drag');
      t.is(tentativeEvent.startDate, new Date(2019, 9, 14, 17, 45), 'Correct startDate at drag end');
      tentativeDates = h.getTentativeDates();
      t.expect(tentativeDates).toEqual([[new Date(2019, 9, 14, 17, 45), new Date(2019, 9, 14, 18), `5:45 PM${h.Text.CheckInHotel}6 PM`]]);
      await h.drop();
      t.is(eventRecord.startDate, new Date(2019, 9, 14, 17, 45), 'Correct startDate after drag');
      t.is(eventRecord.endDate, new Date(2019, 9, 14, 18), 'Correct endDate after drag');
      tentativeDates = h.getTentativeDates();
      t.expect(tentativeDates).toEqual([]);
      t.is(h.isHovering(el), '', 'Hovering ended');
    });
    t.it('Should be able to drag endDate down and up', async t => {
      await h.init(t);
      const eventRecord = h.eventStore.getById(h.Event.CheckInHotel);
      const [el, offset] = await h.hoverBottom(eventRecord.id);
      t.is(h.isHovering(el), 'bottom-edge', 'Hovering should be active');
      t.is(eventRecord.startDate, new Date(2019, 9, 14, 14), 'Correct startDate before drag');
      t.is(eventRecord.endDate, new Date(2019, 9, 14, 18), 'Correct endDate before drag');
      await h.drag(el, {
        offset,
        by: [0, -2 * h.DAY_PX_PER_HOUR + h.EDGE_OFFSET]
      });
      const {
        tentativeEvent
      } = h;
      t.is(eventRecord.startDate, new Date(2019, 9, 14, 14), 'Same startDate during drag');
      t.is(eventRecord.endDate, new Date(2019, 9, 14, 18), 'Same endDate during drag');
      t.is(tentativeEvent.endDate, new Date(2019, 9, 14, 16), 'Correct endDate during drag');
      tentativeDates = h.getTentativeDates();
      t.expect(tentativeDates).toEqual([[new Date(2019, 9, 14, 14), new Date(2019, 9, 14, 16), `2 PM${h.Text.CheckInHotel}4 PM`]]);
      await h.moveCursorBy(0, 3 * h.DAY_PX_PER_HOUR);
      t.is(eventRecord.startDate, new Date(2019, 9, 14, 14), 'Same startDate during drag');
      t.is(eventRecord.endDate, new Date(2019, 9, 14, 18), 'Same endDate during drag');
      t.is(tentativeEvent.endDate, new Date(2019, 9, 14, 19), 'Correct endDate during drag');
      tentativeDates = h.getTentativeDates();
      t.expect(tentativeDates).toEqual([[new Date(2019, 9, 14, 14), new Date(2019, 9, 14, 19), `2 PM${h.Text.CheckInHotel}7 PM`]]);
      await h.drop();
      t.is(eventRecord.endDate, new Date(2019, 9, 14, 19), 'Correct endDate after drag');
      tentativeDates = h.getTentativeDates();
      t.expect(tentativeDates).toEqual([]);
      t.is(h.isHovering(el), '', 'Hovering ended');
    });
    t.it('Should be able to drag endDate down and then up', async t => {
      await h.init(t);
      const eventRecord = h.eventStore.getById(h.Event.CheckInHotel);
      const [el, offset] = await h.hoverBottom(eventRecord.id);
      t.is(h.isHovering(el), 'bottom-edge', 'Hovering should be active');
      t.is(eventRecord.startDate, new Date(2019, 9, 14, 14), 'Correct startDate before drag');
      t.is(eventRecord.endDate, new Date(2019, 9, 14, 18), 'Correct endDate before drag');
      await h.drag(el, {
        offset,
        by: [0, h.DAY_PX_PER_HOUR + h.EDGE_OFFSET]
      });
      const {
        tentativeEvent
      } = h;
      t.is(eventRecord.startDate, new Date(2019, 9, 14, 14), 'Same startDate during drag');
      t.is(eventRecord.endDate, new Date(2019, 9, 14, 18), 'Same endDate during drag');
      t.is(tentativeEvent.endDate, new Date(2019, 9, 14, 19), 'Correct endDate during drag');
      tentativeDates = h.getTentativeDates();
      t.expect(tentativeDates).toEqual([[new Date(2019, 9, 14, 14), new Date(2019, 9, 14, 19), `2 PM${h.Text.CheckInHotel}7 PM`]]);
      await h.moveCursorBy(0, -3 * h.DAY_PX_PER_HOUR);
      t.is(eventRecord.startDate, new Date(2019, 9, 14, 14), 'Same startDate during drag');
      t.is(eventRecord.endDate, new Date(2019, 9, 14, 18), 'Same endDate during drag');
      t.is(tentativeEvent.endDate, new Date(2019, 9, 14, 16), 'Correct endDate during drag');
      tentativeDates = h.getTentativeDates();
      t.expect(tentativeDates).toEqual([[new Date(2019, 9, 14, 14), new Date(2019, 9, 14, 16), `2 PM${h.Text.CheckInHotel}4 PM`]]);
      await h.drop();
      t.is(eventRecord.endDate, new Date(2019, 9, 14, 16), 'Correct endDate after drag');
      t.is(h.isHovering(el), '', 'Hovering ended');
    });
    t.it('Should add b-dragging-item and b-resizing classes on drag move', async t => {
      await h.init(t);
      const eventRecord = h.eventStore.getById(h.Event.CheckInHotel);
      const [el, offset] = await h.hoverTop(eventRecord.id);
      t.is(h.isHovering(el), 'top-edge', 'Hovering should be active');
      t.is(eventRecord.startDate, new Date(2019, 9, 14, 14), 'Correct startDate before drag');
      await h.drag(el, {
        offset
      });
      await t.waitFor(1);
      const outerEl = el.closest('.b-draggable-active');
      t.ok(outerEl, 'Draggable is active');
      t.notOk(outerEl.classList.contains('b-draggable-started'), 'Dragging has not started');
      t.notOk(el.classList.contains('b-dragging-item'), 'Item dragging has not started');
      t.notOk(el.classList.contains('b-resizing'), 'Resizing has not started');
      await h.moveCursorBy(0, h.DAY_PX_PER_HOUR + h.EDGE_OFFSET);
      t.ok(outerEl, 'Draggable is active');
      t.ok(outerEl.classList.contains('b-draggable-started'), 'Dragging has started');
      t.ok(el.classList.contains('b-dragging-item'), 'Item dragging has started');
      t.ok(el.classList.contains('b-resizing'), 'Resizing has started');
      await h.drop();
      t.notOk(outerEl.classList.contains('b-draggable-active'), 'Dragging is done');
      t.notOk(outerEl.classList.contains('b-draggable-started'), 'Dragging is done');
      t.notOk(el.classList.contains('b-dragging-item'), 'Item dragging is done');
      t.notOk(el.classList.contains('b-resizing'), 'Resizing is done');
    });
    t.it('should abort drag operation on ESC keypress', async t => {
      await h.init(t);
      const eventRecord = h.eventStore.getById(h.Event.CheckInHotel);
      const [el, offset] = await h.hoverTop(eventRecord.id);
      const {
        startDate,
        endDate
      } = eventRecord;
      await h.drag(el, {
        offset,
        by: [0, 2 * h.DAY_PX_PER_HOUR - h.EDGE_OFFSET]
      });
      t.ok(t.isDragging(), 'Dragging is active');
      const {
        tentativeEvent
      } = h;
      t.is(eventRecord.startDate, new Date(2019, 9, 14, 14), 'Same startDate during drag');
      t.is(tentativeEvent.startDate, new Date(2019, 9, 14, 16), 'Correct startDate during drag');
      tentativeDates = h.getTentativeDates();
      tentativeDates[0].pop();
      t.expect(tentativeDates).toEqual([[new Date(2019, 9, 14, 16), new Date(2019, 9, 14, 18)]]);
      await t.type(null, '[ESC]');
      t.notOk(t.isDragging(), 'Dragging is not active');
      t.is(startDate, eventRecord.startDate, 'Same startDate');
      t.is(endDate, eventRecord.endDate, 'Same endDate');
      tentativeDates = h.getTentativeDates();
      t.expect(tentativeDates).toEqual([]);
    });
    t.it('Should not allow drag at top edge for event starting prior to dayStartTime', async t => {
      await h.init(t);
      h.calendar.modes.day.dayStartTime = 8;
      h.calendar.modes.day.dayEndTime = 20;
      const eventRecord = h.eventStore.getById(h.Event.CheckInHotel);
      let {
        startDate
      } = eventRecord;
      startDate = DateHelper.clearTime(startDate);
      startDate.setHours(6);
      eventRecord.startDate = startDate;
      const [el] = await h.hoverTop(eventRecord.id);
      t.is(h.isHovering(el), 'hidden-top-edge', 'Hovering is not active - top edge is outside of view');
    });
    t.it('Should not allow drag at bottom edge for event ending after dayEndTime', async t => {
      await h.init(t);
      h.calendar.modes.day.dayStartTime = 8;
      h.calendar.modes.day.dayEndTime = 20;
      const eventRecord = h.eventStore.getById(h.Event.CheckInHotel);
      let {
        startDate
      } = eventRecord;
      startDate = DateHelper.clearTime(startDate);
      startDate.setHours(18);
      eventRecord.set({
        startDate,
        endDate: DateHelper.add(startDate, 4, 'h')
      });
      const [el] = await h.hoverBottom(eventRecord.id);
      t.is(h.isHovering(el), 'hidden-bottom-edge', 'Hovering is not active');
    });
    t.it('Should scroll the view when dragging close to the edge', async t => {
      await h.init(t, {
        mode: 'day',
        date: new Date(2021, 5, 2),
        events: [{
          id: 1,
          startDate: '2021-06-02T06:00:00',
          endDate: '2021-06-02T10:00:00',
          name: 'Event 1'
        }],
        modes: {
          day: {
            visibleStartTime: 0
          }
        }
      });
      const {
        calendar
      } = h,
            {
        activeView
      } = calendar,
            {
        overflowElement
      } = activeView,
            event = calendar.eventStore.last;
      let [source, sourceOffset] = await h.hoverBottom(1); //#region Drag event to the bottom edge

      await t.dragTo({
        source,
        sourceOffset,
        target: overflowElement,
        targetOffset: ['50%', '100%-30'],
        dragOnly: true
      }); // Wait until element is scrolled to the bottom

      await t.waitForScrollPosition(overflowElement, calendar.activeView.scrollable.maxY);
      const {
        scrollTop
      } = overflowElement;
      await t.mouseUp(overflowElement, null, ['50%', `100%-${activeView.hourHeight * 2}`]); // safari has 1px difference

      if (!t.bowser.safari) {
        t.is(overflowElement.scrollTop, scrollTop, 'Top scroll is intact');
      } else {
        t.isApprox(overflowElement.scrollTop, scrollTop, 1, 'Top scroll is intact');
      }

      t.is(event.endDate, new Date(2021, 5, 2, 22), 'End date is ok'); //#endregion

      await calendar.activeView.scrollTo(6);
      [source, sourceOffset] = await h.hoverTop(1);
      await t.dragTo({
        source,
        sourceOffset,
        target: overflowElement,
        targetOffset: ['50%', 30],
        dragOnly: true
      });
      await t.waitFor(() => overflowElement.scrollTop <= 1);
      await t.mouseUp(overflowElement, null, ['50%', activeView.hourHeight]);
      t.is(event.startDate, new Date(2021, 5, 2, 1), 'Start date is ok');
    });
    t.describe('Page scrolled', t => {
      t.beforeEach(() => {
        t.enablePageScroll();
      });
      t.it('Should be able to drag when body is scrolled', async t => {
        await h.init(t);
        const eventRecord = h.eventStore.getById(h.Event.CheckInHotel);
        const [el, offset] = await h.hoverTop(eventRecord.id);
        t.is(h.isHovering(el), 'top-edge', 'Hovering should be active');
        t.is(eventRecord.startDate, new Date(2019, 9, 14, 14), 'Correct startDate before drag');
        await h.drag(el, {
          offset,
          by: [0, 2 * h.DAY_PX_PER_HOUR - h.EDGE_OFFSET]
        });
        const {
          tentativeEvent
        } = h;
        t.is(eventRecord.startDate, new Date(2019, 9, 14, 14), 'Same startDate during drag');
        t.is(tentativeEvent.startDate, new Date(2019, 9, 14, 16), 'Correct startDate during drag');
        tentativeDates = h.getTentativeDates();
        t.expect(tentativeDates).toEqual([[new Date(2019, 9, 14, 16), new Date(2019, 9, 14, 18), `4 PM${h.Text.CheckInHotel}6 PM`]]);
        await h.moveCursorBy(0, -4 * h.DAY_PX_PER_HOUR);
        t.is(eventRecord.startDate, new Date(2019, 9, 14, 14), 'Same startDate during drag');
        t.is(tentativeEvent.startDate, new Date(2019, 9, 14, 12), 'Correct startDate at drag end');
        tentativeDates = h.getTentativeDates();
        t.expect(tentativeDates).toEqual([[new Date(2019, 9, 14, 12), new Date(2019, 9, 14, 18), `12 PM${h.Text.CheckInHotel}6 PM`]]);
        await h.drop();
        t.is(eventRecord.startDate, new Date(2019, 9, 14, 12), 'Correct startDate after drag');
        tentativeDates = h.getTentativeDates();
        t.expect(tentativeDates).toEqual([]);
        t.is(h.isHovering(el), '', 'Hovering ended');
      });
    });
    t.it('Should support async finalizing with async beforeDragResizeEnd listener', async t => {
      await h.init(t);
      const eventRecord = h.eventStore.getById(h.Event.CheckInHotel);
      const [el, offset] = await h.hoverTop(eventRecord.id);
      h.calendar.on({
        beforeDragResizeEnd: async ({
          context
        }) => {
          const result = await MessageDialog.confirm({
            title: 'Please confirm',
            message: 'Is this what you want, what you really really want?'
          }); // Return true to accept the drop or false to reject it

          return result === MessageDialog.yesButton;
        }
      });
      t.firesOnce(h.calendar, 'beforeDragResizeEnd');
      t.firesOnce(h.calendar, 'dragResizeEnd');
      t.firesOnce(h.calendar.eventStore, 'update');
      await h.drag(el, {
        offset,
        by: [0, -2 * h.DAY_PX_PER_HOUR - h.EDGE_OFFSET]
      });
      await h.drop();
      await t.click('button:contains(OK)');
    });
    t.it('Should support async vetoing with async beforeDragResizeEnd listener', async t => {
      await h.init(t);
      const eventRecord = h.eventStore.getById(h.Event.CheckInHotel);
      const [el, offset] = await h.hoverTop(eventRecord.id);
      h.calendar.on({
        beforeDragResizeEnd: async ({
          context
        }) => {
          const result = await MessageDialog.confirm({
            title: 'Please confirm',
            message: 'Is this what you want, what you really really want?'
          }); // Return true to accept the drop or false to reject it

          return result === MessageDialog.yesButton;
        }
      });
      t.firesOnce(h.calendar, 'beforeDragResizeEnd');
      t.wontFire(h.calendar, 'dragResizeEnd');
      t.wontFire(h.calendar.eventStore, 'update');
      await h.drag(el, {
        offset,
        by: [0, -2 * h.DAY_PX_PER_HOUR - h.EDGE_OFFSET]
      });
      await h.drop();
      await t.click('button:contains(Cancel)');
    });
  });
});