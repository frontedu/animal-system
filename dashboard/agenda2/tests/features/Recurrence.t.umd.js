"use strict";

StartTest(t => {
  // eslint-disable-next-line no-unused-vars
  let calendar;
  t.beforeEach(function () {
    var _calendar;

    (_calendar = calendar) === null || _calendar === void 0 ? void 0 : _calendar.destroy();
  });
  t.it('Should support recurring events + exceptionDates', async t => {
    calendar = await t.getCalendar({
      date: new Date(2019, 9, 14),
      mode: 'week',
      events: [{
        id: 1,
        startDate: new Date(2019, 9, 14, 12),
        recurrenceRule: 'FREQ=DAILY',
        // Support array
        exceptionDates: ['2019-10-17'],
        cls: 'recur1',
        duration: 1,
        durationUnit: 'h'
      }, {
        id: 2,
        startDate: new Date(2019, 9, 14, 15),
        recurrenceRule: 'FREQ=DAILY',
        // Support comma based string
        exceptionDates: '2019-10-17,2019-10-18',
        cls: 'recur2',
        duration: 1,
        durationUnit: 'h'
      }]
    });
    t.selectorCountIs('.b-cal-event-wrap.recur1', 5, '5 events in the week since we start on Monday and skip Friday');
    t.selectorCountIs('.b-cal-event-wrap.recur2', 4, '4 events in the week since we start on Monday and skip Friday + Saturday');
  });
});