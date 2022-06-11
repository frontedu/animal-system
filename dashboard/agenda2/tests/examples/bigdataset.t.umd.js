"use strict";

StartTest(t => {
  t.it('Sanity', async t => {
    await t.waitForSelector('.b-cal-event-wrap');
    const calendar = bryntum.query('calendar');
    t.chain({
      click: () => calendar.widgetMap.eventFilter.input
    }, {
      type: 'super busy'
    }, {
      waitFor: () => t.query('.b-calendarrow .b-cal-event').length === 7
    }, {
      waitFor: () => t.query('.b-weekview .b-dayview-day-detail .b-cal-event').length === 0
    }, {
      click: () => calendar.widgetMap.eventFilter.triggers.clear.element
    }, {
      waitForSelector: '.b-weekview .b-dayview-day-detail .b-cal-event'
    }, {
      click: '.b-resourcefilter .b-list-item:contains(Adam K Miller)'
    }, {
      click: '.b-resourcefilter .b-list-item:contains(Adam K Miller)'
    }, {
      click: '[data-ref="toggleSideBar"]'
    }, {
      click: '.b-calendarrow [data-header-date="2020-10-16"]'
    }, {
      waitForAnimations: null
    }, {
      click: '.b-cal-cell-overflow'
    }, () => {
      const {
        activeView
      } = calendar,
            {
        overflowPopup
      } = activeView.allDayEvents; // The +n more button takes up the whole width, and with only 768 pixels of height
      // there's no room either side, so the overflowPopup MUST be willing to shrink in height.

      t.ok(Rectangle.content(calendar.element).contains(Rectangle.from(overflowPopup.element)));
    });
  });
});