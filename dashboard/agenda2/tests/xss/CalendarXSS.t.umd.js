"use strict";

StartTest(t => {
  let calendar, eventStore, harness, agenda, year, month, week, day;

  async function getCalendar(config) {
    const calendar = await t.getCalendar(config);
    eventStore = calendar.eventStore; // eslint-disable-next-line no-unused-vars

    ({
      agenda,
      year,
      month,
      week,
      day
    } = calendar.modes);
    return calendar;
  }

  t.beforeEach(function () {
    var _harness, _calendar;

    // Set doc styling to default values
    document.body.style.paddingTop = 0;
    document.scrollingElement.scrollTop = 0;

    if (calendar && !calendar.isDestroyed) {
      const eventEls = calendar.element.querySelectorAll('.b-calendar-cell.b-dayview-day-detail .b-cal-event-wrap'); // Check that no events ever get placed outside the visible bounds
      // https://github.com/bryntum/support/issues/3585

      for (let i = 0, {
        length
      } = eventEls; i < length; i++) {
        if (parseFloat(eventEls[i].style.top) > 100) {
          t.fail(`Event ${eventEls[i].dataset.eventId} element is rendered out of bounds`);
        }
      }
    }

    harness = (_harness = harness) === null || _harness === void 0 ? void 0 : _harness.destroy();
    (_calendar = calendar) === null || _calendar === void 0 ? void 0 : _calendar.destroy(); // Check that none of the floating things are persisting

    if (t.query('.b-overflowpopup,.b-sch-event-tooltip.b-eventeditor').length > 0) {
      t.selectorNotExists('.b-overflowpopup:visible');
      t.selectorNotExists('.b-sch-event-tooltip');
      t.selectorNotExists('.b-eventeditor');
    }
  });
  t.it('Should safely render dates in day zone', async t => {
    eventStore = new EventStore({
      data: [{
        id: 1,
        name: `<div>XSS</div>`,
        startDate: '2019-10-19T10:00:00',
        endDate: '2019-10-19T12:00:00'
      }]
    });
    calendar = await getCalendar({
      date: new Date(2019, 9, 19),
      mode: 'day',
      eventStore
    });
    await t.waitForSelector('.b-cal-event-desc:contains("<div")');
  });
  t.it('Should safely render dates in all day zone', async t => {
    eventStore = new EventStore({
      data: [{
        id: 1,
        name: `<div>XSS</div>`,
        allDay: true,
        startDate: '2019-10-19T00:00:00',
        endDate: '2019-10-20T00:00:00'
      }]
    });
    calendar = await getCalendar({
      date: new Date(2019, 9, 19),
      mode: 'day',
      eventStore
    });
    await t.waitForSelector('.b-cal-event-desc:contains("<div")');
  });
  t.it('Should safely render dates in month view', async t => {
    eventStore = new EventStore({
      data: [{
        id: 1,
        name: `<div>XSS</div>`,
        allDay: true,
        startDate: '2019-10-19T00:00:00',
        endDate: '2019-10-20T00:00:00'
      }]
    });
    calendar = await getCalendar({
      date: new Date(2019, 9, 1),
      mode: 'month',
      eventStore
    });
    await t.waitForSelector('.b-cal-event-desc:contains("<div")');
  });
  t.it('Should safely render dates in agenda view', async t => {
    eventStore = new EventStore({
      data: [{
        id: 1,
        name: `<div>XSS 1</div>`,
        allDay: true,
        startDate: '2019-10-19T00:00:00',
        endDate: '2019-10-20T00:00:00'
      }, {
        id: 2,
        name: `<div>XSS 2</div>`,
        startDate: '2019-10-19T10:00:00',
        endDate: '2019-10-19T12:00:00'
      }]
    });
    calendar = await getCalendar({
      date: new Date(2019, 9, 1),
      mode: 'agenda',
      eventStore
    });
    await t.waitForSelector('.b-cal-event-desc:contains("<div")');
  });
});