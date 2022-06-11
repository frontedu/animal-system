"use strict";

/* eslint-disable quote-props */
StartTest(t => {
  // eslint-disable-next-line no-unused-vars
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
  t.it('allDay event', async t => {
    calendar = await getCalendar({
      sidebar: false,
      height: 650,
      width: 800,
      date: '2019-12-29',
      eventStore: {
        data: [{
          name: 'All day event',
          startDate: '2020-01-04T12:00:00',
          duration: 2,
          durationUnit: 'h',
          allDay: true,
          id: 'test-event',
          resourceId: 'r1'
        }]
      },
      resourceStore: {
        data: [{
          id: 'r1',
          name: 'Calendar 1'
        }]
      },
      mode: 'month',
      modes: {
        agenda: null,
        year: null,
        month: true,
        week: true,
        day: null
      }
    });
    const event = week.eventStore.first;
    t.chain({
      click: 'button:contains(Week)'
    }, async () => t.is(calendar.mode, 'week'), async () => {
      const eventEl = week.allDayEvents.getEventElement(event);
      t.selectorExists('[data-event-id="test-event"]');
      t.isApproxPx(week.allDayEvents.height, 115, 2, 'All day events row correct height');
      t.isApproxPx(parseInt(eventEl.style.width), 14, 'Event correctly spans 1 day');
      t.isApproxPx(parseInt(eventEl.style.top), 0, 2, 'Event correctly clears the cell day header');
      event.allDay = false;
    }, {
      click: 'button:contains(Month)'
    }, async () => t.is(calendar.mode, 'month'), async () => {
      const eventEl = month.getEventElement(event);
      t.isApproxPx(parseInt(eventEl.style.top), 25, 'Event correctly clears the cell day header');
    }, {
      click: '.b-monthview-content .b-calendar-cell[data-date="2020-01-04"]',
      offset: ['50%', '80%']
    }, {
      dblclick: () => month.getEventElement(event)
    }, {
      click: 'input[type="checkbox"][name="allDay"]'
    }, {
      waitForEvent: [calendar.modes.month, 'refresh'],
      trigger: {
        click: 'button:contains(Save) '
      }
    }, {
      click: 'button:contains(Week)'
    }, async () => t.is(calendar.mode, 'week'), // The allDayEvents animates to its height.
    {
      waitFor: () => Math.abs(week.allDayEvents.height - 115) < 3
    }, // Now must be back to how it was
    () => {
      const eventEl = week.allDayEvents.getEventElement(event);
      t.selectorExists('[data-event-id="test-event"]');
      t.isApproxPx(week.allDayEvents.height, 115, 2, 'All day events row correct height');
      t.isApproxPx(parseInt(eventEl.style.width), 14, 'Event correctly spans 1 day');
      t.isApproxPx(parseInt(eventEl.style.top), 0, 2, 'Event correctly clears the cell day header');
    });
  });
  t.it('Many all day events in the all day row', async t => {
    const date = new Date(2019, 9, 15, 9);
    eventStore = new EventStore({
      data: ArrayHelper.populate(45, i => {
        const id = String(i + 1);
        return {
          duration: 1,
          durationUnit: 'day',
          id,
          name: `Event ${id}`,
          resourceId: 'r1',
          startDate: date,
          allDay: true
        };
      })
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
      mode: 'week'
    });
    const dayView = calendar.activeView,
          {
      allDayEvents,
      dayContainerElement
    } = dayView,
          {
      bodyElement,
      cellContainer
    } = allDayEvents,
          {
      scrollBarWidth
    } = DomHelper;
    await t.waitForProjectReady(calendar.modes.month); // No overflow in collapsed mode

    t.is(bodyElement.style.overflowY, scrollBarWidth ? 'hidden' : 'auto'); // Widths must be synced.

    t.isApprox(Rectangle.client(dayContainerElement).width, Rectangle.client(cellContainer).width); // Expand the all day events to show all the all day events.
    // This should result in there being events overflowing

    await t.click(dayView.cornerElement);
    await dayView.heightAnimation; // Scrollable overflow in expanded mode.

    await t.waitFor(() => bodyElement.style.overflowY === 'auto'); // Widths must still be synced.

    t.isApprox(Rectangle.client(dayContainerElement).width, Rectangle.client(cellContainer).width); // Collapse the all day events so that there's a [+n more] pill to show overflowing events

    await t.click(dayView.cornerElement);
    await dayView.heightAnimation; // No overflow in collapsed mode.

    await t.waitFor(() => bodyElement.style.overflowY === scrollBarWidth ? 'hidden' : 'auto'); // Widths must still be synced.

    t.isApprox(Rectangle.client(dayContainerElement).width, Rectangle.client(cellContainer).width);
    calendar.height = 500;
    await t.click('button.b-cal-cell-overflow');
    const {
      overflowPopup
    } = allDayEvents; // Overflow must be within available space inside the constrainPadding margins.

    t.samePx(overflowPopup.height, calendar.height - overflowPopup.align.constrainPadding * 2);
    t.samePx(overflowPopup.y, overflowPopup.align.constrainPadding);
  });
  t.it('All day row autoHeight', async t => {
    const date = new Date(2019, 9, 15, 9);
    eventStore = new EventStore({
      data: ArrayHelper.populate(45, i => {
        const id = String(i + 1);
        return {
          duration: 1,
          durationUnit: 'hour',
          id,
          name: `Event ${id}`,
          resourceId: 'r1',
          startDate: date,
          endDate: DateHelper.add(date, 1, 'h'),
          allDay: true
        };
      })
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
      mode: 'week',
      modes: {
        week: {
          allDayEvents: {
            autoHeight: true
          }
        }
      }
    });
    const dayView = calendar.activeView,
          {
      allDayEvents,
      dayContainerElement
    } = dayView,
          {
      bodyElement,
      cellContainer
    } = allDayEvents;
    await t.waitForProjectReady(calendar.modes.week);
    await t.waitFor(() => calendar.element.querySelectorAll('.b-cal-event-wrap.b-allday').length === eventStore.count);
    await t.waitForAnimations(); // Scrollable overflow in autoHeight mode.

    await t.waitFor(() => bodyElement.style.overflowY === 'auto'); // Widths must be synced.

    t.isApprox(Rectangle.client(dayContainerElement).width, Rectangle.client(cellContainer).width);
  });
  t.it('All day row autoHeight no overflow -> overflow', async t => {
    const date = new Date(2019, 9, 15, 9);
    eventStore = new EventStore({
      data: ArrayHelper.populate(45, i => {
        const id = String(i + 1);
        return {
          duration: 1,
          durationUnit: 'hour',
          id,
          name: `Event ${id}`,
          resourceId: 'r1',
          startDate: date,
          endDate: DateHelper.add(date, 1, 'h'),
          allDay: true
        };
      })
    }); // Start with only four all day events visible.
    // There should be no overflow. The all day row should shrinkwrap this.

    eventStore.filter(e => e.id < 5);
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
      mode: 'week',
      modes: {
        week: {
          allDayEvents: {
            autoHeight: true
          }
        }
      }
    });
    const dayView = calendar.activeView,
          {
      allDayEvents,
      dayContainerElement
    } = dayView,
          {
      scrollable
    } = allDayEvents,
          {
      bodyElement,
      cellContainer
    } = allDayEvents,
          {
      scrollBarWidth
    } = DomHelper;
    await t.waitForProjectReady(calendar.modes.week);
    await t.waitForAnimations();
    await t.waitFor(() => !scrollable.hasOverflow() && calendar.element.querySelectorAll('.b-cal-event-wrap.b-allday').length === 4); // Non scrollable when there's no overflow.

    await t.waitFor(() => bodyElement.style.overflowY === scrollBarWidth ? 'hidden' : 'auto'); // Widths must be synced.

    t.isApprox(Rectangle.client(dayContainerElement).width, Rectangle.client(cellContainer).width); // Increase to 45 events. The all day row must only grow up to 50% height and overflow

    eventStore.clearFilters();
    await t.waitFor(() => calendar.element.querySelectorAll('.b-cal-event-wrap.b-allday').length === eventStore.count);
    await t.waitForAnimations(); // All day row must not exceed max-height : 50% at default settings

    t.isLessOrEqual(dayView.allDayEvents.height, dayView.height / 2); // Scrollable overflow in expanded mode.

    await t.waitFor(() => bodyElement.style.overflowY === 'auto'); // Widths must be synced.

    t.isApprox(Rectangle.client(dayContainerElement).width, Rectangle.client(cellContainer).width);
  });
});