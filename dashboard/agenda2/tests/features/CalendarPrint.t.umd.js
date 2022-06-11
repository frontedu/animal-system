"use strict";

StartTest(t => {
  // eslint-disable-next-line no-unused-vars
  let calendar, eventStore, resourceStore;

  async function getCalendar(mode) {
    calendar = await t.getCalendar({
      date: new Date(2019, 9, 14),
      mode,
      features: {
        print: true
      },
      eventStore,
      resourceStore
    });
    await t.waitFor(1);
  }

  t.beforeEach(t => {
    var _calendar;

    (_calendar = calendar) === null || _calendar === void 0 ? void 0 : _calendar.destroy();
    t.simulator.setSpeed('speedRun');
    eventStore = new EventStore({
      data: t.getHackathonData().events.rows
    });
    resourceStore = new ResourceStore({
      data: t.getHackathonData().resources.rows
    });
  });
  t.it('Print Day View', async t => {
    await getCalendar('day');
    let page;
    t.chain(next => {
      calendar.on({
        print(pages) {
          t.ok(pages[0].html, 'HTML is set');
          page = pages[0].html;
          next();
        }

      });
      calendar.features.print.print({
        debug: true
      });
    }, next => {
      t.setIframe({
        html: page,

        onload(doc, frame) {
          t.is(doc.querySelectorAll('body.b-print').length, 1, 'Print body found');
          t.is(doc.querySelectorAll('.b-timeaxis-container .b-dayview-timeaxis-time').length, 23, '23 exported time cells found');
          t.is(doc.querySelectorAll('.b-dayview-day-container [data-date="2019-10-14"]').length, 1, 'Day container found');
          t.is(doc.querySelector('.b-dayview-day-container [data-event-id="2"] .b-cal-event-desc').textContent, 'Check-In in Hotel', 'Event Check-In in Hotel found');
          t.is(doc.querySelector('.b-cal-cell-header .b-week-num').textContent, '42', 'Header found');
          t.is(doc.querySelector('.b-cal-event-bar-container [data-event-id="1"] .b-cal-event-desc').textContent, 'Hackathon 2019', 'Heaser All day event found');
          frame.remove();
          next();
        }

      });
    });
  });
  t.it('Print Week View', async t => {
    await getCalendar('week');
    let page;
    t.chain(next => {
      calendar.on({
        print(pages) {
          t.ok(pages[0].html, 'HTML is set');
          page = pages[0].html;
          next();
        }

      });
      calendar.features.print.print({
        debug: true
      });
    }, next => {
      t.setIframe({
        html: page,

        onload(doc, frame) {
          t.is(doc.querySelectorAll('body.b-print').length, 1, 'Print body found');
          t.is(doc.querySelectorAll('.b-timeaxis-container .b-dayview-timeaxis-time').length, 23, '23 exported time cells found');
          t.is(doc.querySelectorAll('.b-dayview-day-container [data-date="2019-10-14"]').length, 1, 'Day container found');
          t.is(doc.querySelector('.b-dayview-day-container [data-event-id="2"] .b-cal-event-desc').textContent, 'Check-In in Hotel', 'Event Check-In in Hotel found');
          const headerElements = doc.querySelectorAll('.b-cal-cell-header');
          t.is(headerElements.length, 7, 'Seven day headers found');
          t.is(headerElements[0].querySelector('.b-day-name-day').textContent, 'Sun', 'Week starts at Sunday');
          t.is(headerElements[6].querySelector('.b-day-name-day').textContent, 'Sat', 'Week ends at Saturday');
          frame.remove();
          next();
        }

      });
    });
  });
  t.it('Print Month View', async t => {
    await getCalendar('month');
    let page;
    t.chain(next => {
      calendar.on({
        print(pages) {
          t.ok(pages[0].html, 'HTML is set');
          page = pages[0].html;
          next();
        }

      });
      calendar.features.print.print({
        debug: true
      });
    }, next => {
      t.setIframe({
        html: page,

        onload(doc, frame) {
          t.is(doc.querySelectorAll('body.b-print').length, 1, 'Print body found');
          t.is(doc.querySelectorAll('.b-calendar-week').length, 6, '6 exported rows found');
          t.is(doc.querySelectorAll('[data-event-id="1"]').length, 8, '8 exported cells for event id 1 found');
          t.is(doc.querySelector('[data-event-id="1"]').textContent, 'Hackathon 2019', 'Event found');
          t.is(doc.querySelectorAll('.b-calendar-day-header').length, 7, 'Seven day headers found');
          t.is(doc.querySelectorAll('.b-calendar-day-header.b-weekend.b-nonworking-day').length, 2, 'Two non working days in week found');
          frame.remove();
          next();
        }

      });
    });
  });
  t.it('Print Year View', async t => {
    await getCalendar('year');
    let page;
    t.chain(next => {
      calendar.on({
        print(pages) {
          t.ok(pages[0].html, 'HTML is set');
          page = pages[0].html;
          next();
        }

      });
      calendar.features.print.print({
        debug: true
      });
    }, next => {
      t.setIframe({
        html: page,

        onload(doc, frame) {
          t.is(doc.querySelectorAll('body.b-print').length, 1, 'Print body found');
          t.is(doc.querySelectorAll('.b-calendar-week').length, 12 * 7, '12 * 7 exported week cells found');
          t.is(doc.querySelectorAll('.b-calendar-7-or-more-events[data-date="2019-10-15"]').length, 1, 'Cell has 7 or more events');
          t.is(doc.querySelectorAll('.b-yearview-month-name').length, 12, '12 months found');
          frame.remove();
          next();
        }

      });
    });
  });
  t.it('Print Agenda View', async t => {
    await getCalendar('agenda');
    let page;
    t.chain(next => {
      calendar.on({
        print(pages) {
          t.ok(pages[0].html, 'HTML is set');
          page = pages[0].html;
          next();
        }

      });
      calendar.features.print.print({
        debug: true
      });
    }, next => {
      t.setIframe({
        html: page,

        onload(doc, frame) {
          t.is(doc.querySelectorAll('body.b-print').length, 1, 'Print body found');
          const dayElements = doc.querySelectorAll('.cal-agenda-date-date-number');
          const startDay = 14;
          t.is(dayElements.length, 8, 'Correct number of day elements');
          dayElements.forEach((dayElement, index) => {
            t.is(dayElement.textContent, startDay + index, 'Days number set correctly');
          });
          t.is(doc.querySelector('[data-row-id="1"] .b-cal-event-desc').textContent, 'Hackathon 2019', 'Event found');
          frame.remove();
          next();
        }

      });
    });
  });
});