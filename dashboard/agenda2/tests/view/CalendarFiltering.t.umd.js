"use strict";

StartTest(t => {
  let calendar, eventStore, resourceStore, harness, agenda, year, month, week, day;

  async function getCalendar(config) {
    const calendar = await t.getCalendar(config);
    eventStore = calendar.eventStore;
    resourceStore = calendar.resourceStore; // eslint-disable-next-line no-unused-vars

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
  t.it('Resource filtering', async t => {
    eventStore = new EventStore({
      data: [{
        duration: 1,
        durationUnit: 'hour',
        id: '1',
        name: 'Event 1',
        resourceId: 'r1',
        startDate: new Date(2019, 9, 15, 9)
      }, {
        duration: 1,
        durationUnit: 'hour',
        id: '2',
        name: 'Event 2',
        resourceId: 'r2',
        startDate: new Date(2019, 9, 15, 11)
      }]
    });
    resourceStore = new ResourceStore({
      data: [{
        id: 'r1',
        name: 'Resource 1'
      }, {
        id: 'r2',
        name: 'Resource 2'
      }]
    });
    calendar = await getCalendar({
      date: new Date(2019, 9, 14),
      eventStore,
      resourceStore,
      mode: 'month'
    });
    await t.waitForProjectReady(calendar.modes.month);
    t.chain({
      waitFor: () => document.querySelectorAll('.b-cal-event-wrap').length === 2
    }, {
      waitForEvent: [calendar.modes.month, 'refresh'],
      trigger: {
        click: '[data-ref="resourceFilter"] .b-list-item.b-selected:contains(Resource 1)'
      }
    }, {
      waitFor: () => t.query('.b-cal-event-wrap').length === 1,
      desc: 'Event 1 filtered out'
    }, // Step over the click block time
    {
      waitFor: 500
    }, {
      waitForEvent: [calendar.modes.month, 'refresh'],
      trigger: {
        click: '[data-ref="resourceFilter"] .b-list-item.b-selected:contains(Resource 2)'
      }
    }, {
      waitFor: () => t.query('.b-cal-event-wrap').length === 0,
      desc: 'Both filtered out'
    });
  });
  t.it('Should properly clear out top calendar row if no events match a filter', async t => {
    eventStore = new EventStore({
      data: t.getHackathonData().events.rows
    });
    resourceStore = new ResourceStore({
      data: t.getHackathonData().resources.rows
    });
    calendar = await getCalendar({
      date: new Date(2019, 9, 14),
      eventStore,
      resourceStore,
      mode: 'week'
    });
    eventStore.filter(() => false);
    await t.waitForEvent(calendar.modes.week.allDayEvents, 'refresh');
    t.selectorNotExists('.b-cal-event', 'All event elements filtered out');
    eventStore.clearFilters();
    await t.waitForEvent(calendar.modes.week.allDayEvents, 'refresh');
    t.selectorExists('.b-cal-event', 'Event elements are back');
  }); // https://github.com/bryntum/support/issues/2149

  t.it('Should filter multi assigned task', async t => {
    calendar = await getCalendar({
      date: new Date(2019, 9, 14),
      project: {
        eventsData: [{
          id: 1,
          name: 'Event 1',
          duration: 1,
          durationUnit: 'hour',
          startDate: new Date(2019, 9, 15, 9)
        }],
        resourcesData: [{
          id: 'r1',
          name: 'Resource 1'
        }, {
          id: 'r2',
          name: 'Resource 2'
        }],
        assignmentsData: [{
          id: 1,
          resourceId: 'r1',
          eventId: 1
        }, {
          id: 2,
          resourceId: 'r2',
          eventId: 1
        }]
      }
    });
    await t.waitForProjectReady(calendar);
    t.chain({
      waitForSelector: '.b-resourcefilter'
    }, {
      click: '.b-list-item[data-id="r1"]'
    }, {
      waitForSelector: '.b-cal-event-wrap[data-event-id="1"]',
      desc: 'Event 1 visible after filter for Resource 2'
    }, {
      click: '.b-list-item[data-id="r1"]'
    }, {
      click: '.b-list-item[data-id="r2"]'
    }, {
      waitForSelector: '.b-cal-event-wrap[data-event-id="1"]',
      desc: 'Event 1 visible after filter for Resource 1'
    }, {
      click: '.b-list-item[data-id="r1"]'
    }, {
      waitForSelectorNotFound: '.b-cal-event-wrap[data-event-id="1"]',
      desc: 'Event 1 is not visible after uncheck Resource 1 and Resource 2'
    });
  });
});