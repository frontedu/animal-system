"use strict";

StartTest(t => {
  let calendar;
  t.beforeEach(() => {
    var _calendar, _calendar$destroy;

    (_calendar = calendar) === null || _calendar === void 0 ? void 0 : (_calendar$destroy = _calendar.destroy) === null || _calendar$destroy === void 0 ? void 0 : _calendar$destroy.call(_calendar);
  });
  t.it('Calendar should have minimum height', async t => {
    document.body.innerHTML = '<div id="container" style="width:400px;height:400px;"></div>';
    calendar = new Calendar({
      appendTo: 'container',
      mode: 'month',
      sidebar: false,
      date: new Date(2021, 4, 20),
      events: [{
        name: 'Event 1',
        resourceId: 'hotel',
        startDate: '2021-05-06',
        endDate: '2021-05-07'
      }, {
        name: 'Event 2',
        resourceId: 'hotel',
        startDate: '2021-05-06',
        endDate: '2021-05-07'
      }, {
        name: 'Event 3',
        resourceId: 'hotel',
        startDate: '2021-05-06',
        endDate: '2021-05-07'
      }, {
        name: 'Event 4',
        resourceId: 'hotel',
        startDate: '2021-05-06',
        endDate: '2021-05-07'
      }],
      resources: [{
        id: 'hotel',
        name: 'Hotel'
      }]
    });
    await calendar.activeView.await('refresh', false);
    await t.waitForSelector('.b-cal-event');
    calendar.activeView.eventHeight = '3em';
    await calendar.activeView.await('refresh', false);
    t.is(calendar.activeView.eventsPerCell, 2, 'There is a room for at least two events');
    t.selectorCountIs('.b-cal-event', 1, 'Single event is rendered');
  });
});