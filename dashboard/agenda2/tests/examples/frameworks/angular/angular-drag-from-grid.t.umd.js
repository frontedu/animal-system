"use strict";

StartTest(t => {
  const calendar = bryntum.query('calendar');
  const {
    eventStore
  } = calendar;
  t.it('Rendering', async t => {
    // Check scheduler
    await t.waitForSelector('.b-cal-event'); // Check grid

    await t.waitForSelector('.b-grid-cell:contains(Angular bug fix)');
  });
  t.it('Dragging', async t => {
    var _eventStore$changes;

    // Drag from grid to calendar
    await t.dragTo({
      source: '.b-grid-cell:contains(Angular bug fix)',
      target: calendar.viewContainer.element,
      targetOffset: ['30%', '30%']
    }); // Check whether event store contains dragged event

    await t.is((_eventStore$changes = eventStore.changes) === null || _eventStore$changes === void 0 ? void 0 : _eventStore$changes.added[0].data.name, 'Angular bug fix', 'Dragged event is in calendar');
  });
});