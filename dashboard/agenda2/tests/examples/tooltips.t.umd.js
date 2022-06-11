"use strict";

StartTest(t => {
  t.it('Sanity', t => {
    t.chain({
      waitForSelector: '.b-cal-event-wrap'
    }, {
      moveMouseTo: '.b-cal-event-wrap:contains(Go for cold swim)'
    }, {
      waitForSelector: '.b-sch-event-tooltip .b-header-title:contains(Go for cold swim)'
    });
  });
});