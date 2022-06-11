"use strict";

StartTest(t => {
  let calendar;
  t.it('Sanity', t => {
    t.chain({
      waitForSelector: '.b-cal-event-wrap'
    }, next => {
      calendar = bryntum.query('calendar');
      next();
    }, {
      click: '.b-button:contains(Create)'
    }, {
      waitForSelector: '.b-cal-event:contains(New event)'
    }, {
      waitForSelector: 'input[name=name]:focus'
    }, {
      type: 'Test event',
      clearExisting: true
    }, // Cancel UI must appear since this is a "new" record we are editing.
    {
      waitForSelector: '.b-button:contains(Cancel)'
    }, {
      click: '.b-button:contains(Save)'
    }, {
      waitForSelector: '.b-cal-event:contains(Test event)'
    }, {
      click: '[data-ref="yearShowButton"]'
    }, {
      click: '[data-ref="addNew"]'
    }, // Editor must successfully start
    {
      waitFor: () => {
        var _calendar$features$ev;

        return (_calendar$features$ev = calendar.features.eventEdit.editor) === null || _calendar$features$ev === void 0 ? void 0 : _calendar$features$ev.containsFocus;
      }
    });
  });
});