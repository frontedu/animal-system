"use strict";

StartTest(t => {
  // Test coverage for example code snippet from CalendarRow docs
  // Calendar/docs/data/Calendar/examples/widget/CalendarRow.js
  // Test will fail until this issue is fixed: https://github.com/bryntum/support/issues/2893
  t.xit('Should instantiate CalendarRow', async t => {
    t.livesOk(() => {
      const widget = new CalendarRow({
        appendTo: document.body,
        startDate: new Date(2020, 8, 3),
        endDate: new Date(2020, 8, 8),
        month: new Month(8),
        events: [{
          startDate: '2020-09-04T07:00',
          duration: 5,
          durationUnit: 'h',
          name: 'Walk the dog',
          eventColor: 'yellow'
        }, {
          startDate: '2020-09-04T09:00',
          duration: 2,
          durationUnit: 'h',
          name: 'Buy masks',
          eventColor: 'orange'
        }, {
          startDate: '2020-09-05T07:00',
          duration: 1,
          durationUnit: 'h',
          name: 'Zoom meeting',
          eventColor: 'deep-orange'
        }, {
          startDate: '2020-09-05T09:00',
          duration: 1,
          durationUnit: 'h',
          name: 'Get a haircut',
          eventColor: 'gray'
        }]
      });
      widget.destroy();
    }, 'Should instantiate CalendarRow');
  });
});