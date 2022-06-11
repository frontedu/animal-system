"use strict";

StartTest(t => {
  const {
    MILLIS_PER_DAY
  } = DayTime,
        iconClasses = ['b-fa-circle', 'b-fa-flag', 'b-fa-clock', 'b-fa-cloud', 'b-fa-cog', 'b-fa-diamond'];
  let calendar, dayView, eventStore, resourceStore;

  function calcY(date) {
    const delta = dayView.dayTime.delta(date, 'h');
    return dayView.hourHeight * delta;
  }

  async function getDayView(t, config, data = t.getHackathonData(18, 13)) {
    // eslint-disable-next-line no-undef
    eventStore = new EventStore({
      data: data.events.rows
    }); // eslint-disable-next-line no-undef

    resourceStore = new ResourceStore({
      data: data.resources.rows
    }); // Default configuration is the hackathon schedule dataset

    dayView = await t.getDayView(t, Object.assign({
      eventStore,
      resourceStore,
      width: 1000,
      height: 700,
      dayStartShift: 18,
      startDate: '2019-10-14',
      endDate: '2019-10-22',
      allDayEvents: {
        eventHeight: 20
      }
    }, config));
    eventStore = dayView.eventStore;
    resourceStore = dayView.resourceStore;
    await t.waitForAnimationFrame();
    checkEventSanity(t, dayView);
    return dayView;
  }

  function checkEventSanity(t, dayView) {
    const endDate = new Date(dayView.endDate); // The "dates" in the collected day cells must be shifted in line with the view's startShift
    // to reflect the *logical* day that each cell covers.

    dayView.cellMap.forEach(cellData => {
      t.is(DateHelper.getTimeOfDay(cellData.date), dayView.dayTime.startShift);
    });
    t.is(dayView.eventHeight, 'auto', 'Setting eventHeight is invalid for DayView'); // lastVisible date is *inclusive* - it references a *day*, not a timestamp which is
    // what the endDate does.

    endDate.setDate(endDate.getDate() - 1);
    t.is(dayView.lastVisibleDate, endDate, 'Correct lastVisibleDate'); // DayView uses raw events, not the renderedEvents slots

    const events = [...dayView.cellMap.values()].reduce((v, c) => {
      v.push(...c.events);
      return v;
    }, []);
    events.forEach(event => {
      const eventEl = dayView.getEventElement(event),
            {
        allDay
      } = event;

      if (eventEl) {
        t.isApproxPx(eventEl.offsetTop, allDay ? 0 : calcY(event.startDate), `Event ${event.name} top correct`); // dayEndTime truncates height.
        // TODO: Calculate and check correct height when truncated by a dayEndTime

        if (!dayView.dayEndTime) {
          t.isApproxPx(eventEl.offsetHeight, allDay ? dayView.dayContainerElement.offsetHeight : DateHelper.as('hours', event.endDate - event.startDate, 'ms') * dayView.hourHeight, `Event ${event.name} height correct`);
        }
      }
    });
  }

  async function ready(t) {
    await t.waitForSelector('.b-dayview-timeaxis-time:first-child:contains(7 PM)');
  }

  function stairStepEvent(i, offset = 21, duration = 2) {
    const start = i + offset;
    const end = start + duration;
    return [i + Math.floor(start / 24), start % 24, i + Math.floor(end / 24), end % 24];
  }

  t.beforeEach(() => {
    var _dayView, _calendar;

    dayView = (_dayView = dayView) === null || _dayView === void 0 ? void 0 : _dayView.destroy();
    calendar = (_calendar = calendar) === null || _calendar === void 0 ? void 0 : _calendar.destroy();
  });
  t.afterEach(async t => {
    if (dayView && !dayView.isDestroyed) {
      if (dayView.timeAxisElement.offsetWidth !== dayView.cornerElement.offsetWidth) {
        t.fail('TimeAxis column widths correctly synced');
      }

      if (dayView.allDayEvents.scrollable.maxX) {
        t.fail('All day row correctly not scrollable');
      }
    } // Check that none of the floating things are persisting


    if (t.query('.b-overflowpopup:visible,.b-sch-event-tooltip, .b-eventeditor').length > 0) {
      await t.waitForSelectorNotFound('.b-overflowpopup:visible');
      await t.waitForSelectorNotFound('.b-sch-event-tooltip');
      await t.waitForSelectorNotFound('.b-eventeditor');
    }
  });
  t.it('sanity', async t => {
    dayView = await getDayView(t); // Wait for layout to be correct

    await ready(t);
    await t.waitForSelector('.b-dayview-timeaxis-time:last-child:contains(5 PM)'); // This should have no effect.

    dayView.dayContainerElement.scrollTop = 100;
    t.isApproxPx(dayView.dayContainerElement.scrollTop, 0, 'Background el sizing correct, causes no scrolling');
    t.isApproxPx(dayView.getDayElement(dayView.startDate).offsetHeight, dayView.hourHeight * dayView.getDayLength('hours'), 'DayView dayElement height is correct');
    dayView.dayStartTime = 20; // Wait for layout to be correct

    await t.waitForSelector('.b-dayview-timeaxis-time:first-child:contains(9 PM)');
    await t.waitForSelector('.b-dayview-timeaxis-time:last-child:contains(5 PM)');
    t.isApproxPx(dayView.getDayElement(dayView.startDate).offsetHeight, dayView.hourHeight * dayView.getDayLength('hours'), 'DayView dayElement height is correct');
    dayView.dayEndTime = 13; // Wait for layout to be correct

    await t.waitForSelector('.b-dayview-timeaxis-time:first-child:contains(9 PM)');
    await t.waitForSelector('.b-dayview-timeaxis-time:last-child:contains(12 PM)');
    checkEventSanity(t, dayView);
  });
  t.it('should correctly change dayStartShift from initial value of 0', async t => {
    dayView = await getDayView(t, {
      dayStartShift: 0
    }); // Wait for layout to be correct

    await t.waitForSelector('.b-dayview-timeaxis-time:first-child:contains(1 AM)');
    await t.waitForSelector('[data-header-date=2019-10-17] .b-day-name-day:contains(Thu)');
    await t.waitForSelector('[data-header-date=2019-10-17] .b-day-name-date:contains(17)');
    dayView.dayStartShift = 18;
    await ready(t);
    await t.waitForSelector('.b-dayview-timeaxis-time:last-child:contains(5 PM)');
    checkEventSanity(t, dayView);
  });
  t.it('Current time line', async t => {
    const now = new Date(),
          tod = DateHelper.getTimeOfDay(now);
    dayView = await getDayView(t, {
      date: now
    });
    await ready(t);
    const indicator = document.querySelector('.b-current-time-indicator'),
          actual = parseFloat(indicator.style.top),
          start = dayView.dayStartTime,
          deltaMillis = tod < start ? MILLIS_PER_DAY - start + tod : tod - start,
          expected = deltaMillis / MILLIS_PER_DAY * 100;
    t.isApproxPx(expected * 100, actual * 100, 'Indicator is in correct position');
  });
  t.it('Interaction', async t => {
    eventStore = t.getEventStore({
      data: function () {
        const events = [];

        for (let endD, endH, startD, startH, i = 1; i <= 5; i++) {
          [startD, startH, endD, endH] = stairStepEvent(i);
          events.push({
            id: i,
            cls: 'event' + i,
            resourceId: 'r' + i,
            name: 'Assignment ' + i,
            startDate: new Date(2011, 0, 3 + startD, startH),
            endDate: new Date(2011, 0, 3 + endD, endH),
            iconCls: iconClasses[i]
          });
        }

        return events;
      }()
    });
    resourceStore = t.getResourceStore({
      data: [{
        id: 'r1',
        name: 'Mike',
        eventColor: 'red'
      }, {
        id: 'r2',
        name: 'Linda',
        eventColor: 'orange'
      }, {
        id: 'r3',
        name: 'Don',
        eventColor: '#f1c114'
      }, {
        id: 'r4',
        name: 'Karen',
        eventColor: 'green'
      }, {
        id: 'r5',
        name: 'Doug',
        eventColor: 'blue'
      }, {
        id: 'r6',
        name: 'Peter',
        eventColor: 'indigo'
      }]
    });
    dayView = await getDayView(t, {
      eventStore,
      resourceStore,
      startDate: new Date(2011, 0, 4),
      endDate: new Date(2011, 0, 9)
    });
    ['daynumbermousedown', 'daynumbermouseup', 'daynumberclick', 'eventmouseover', 'eventmousedown', 'eventmouseup', 'eventclick'].forEach(eventName => t.firesOnce(dayView, eventName));
    await t.click('.b-cal-cell-header');
    await t.click('.b-cal-event');
  });
  t.it('Click interaction', async t => {
    dayView = await getDayView(t);
    const dayViewEvents = [];
    dayView.on({
      catchAll(e) {
        if (e.type.toLowerCase().endsWith('click')) {
          dayViewEvents.push(e);
        }
      }

    });
    await ready(t);
    await t.click('.b-dayview-day-content .b-calendar-cell[data-date="2019-10-15"]', null, null, null, ['50%', dayView.hourHeight * 3.5]);
    t.is(dayViewEvents[0].date, new Date(2019, 9, 15, 21, 30), 'Correct event fired');
    dayView.dayStartTime = 22;
    dayView.dayEndTime = 7;
    await t.click(dayView.dayContainerElement, null, null, null, [-10, '99%']);
    t.is(dayViewEvents.length, 1, 'Clicking outside of the day didn\'t fire an event');
  });
  t.it('hideNonworkingDays', async t => {
    eventStore = t.getEventStore({
      data: function () {
        const events = [];

        for (let endD, endH, startD, startH, i = 1; i <= 6; i++) {
          [startD, startH, endD, endH] = stairStepEvent(i);
          events.push({
            id: i,
            cls: 'event' + i,
            resourceId: 'r' + i,
            name: 'Assignment ' + i,
            startDate: new Date(2011, 0, 3 + startD, startH),
            endDate: new Date(2011, 0, 3 + endD, endH),
            iconCls: iconClasses[i]
          });
        }

        return events;
      }()
    });
    resourceStore = t.getResourceStore({
      data: [{
        id: 'r1',
        name: 'Mike',
        eventColor: 'red'
      }, {
        id: 'r2',
        name: 'Linda',
        eventColor: 'orange'
      }, {
        id: 'r3',
        name: 'Don',
        eventColor: '#f1c114'
      }, {
        id: 'r4',
        name: 'Karen',
        eventColor: 'green'
      }, {
        id: 'r5',
        name: 'Doug',
        eventColor: 'blue'
      }, {
        id: 'r6',
        name: 'Peter',
        eventColor: 'indigo'
      }]
    });
    dayView = await getDayView(t, {
      eventStore,
      resourceStore,
      startDate: new Date(2011, 0, 4),
      endDate: new Date(2011, 0, 10)
    });
    t.is(dayView.eventElements.length, 6, 'Correct number of event elements');
    t.is(dayView.allDayEvents.weekLength, 6, 'Correct number of all day event elements');
    t.selectorCountIs(`.b-dayview-day-container .${dayView.dayCellCls}`, 6);
    dayView.hideNonWorkingDays = true;
    t.is(dayView.eventElements.length, 4, 'Correct number of event elements');
    t.is(dayView.allDayEvents.weekLength, 4, 'Correct number of all day event elements');
    t.selectorCountIs(`.b-dayview-day-container .${dayView.dayCellCls}`, 4);
    dayView.hideNonWorkingDays = false;
    t.is(dayView.eventElements.length, 6, 'Correct number of event elements');
    t.is(dayView.allDayEvents.weekLength, 6, 'Correct number of all day event elements');
    t.selectorCountIs(`.b-dayview-day-container .${dayView.dayCellCls}`, 6);
  });
  t.it('hideNonworkingDays with week starting on Sunday', async t => {
    const eventStore = t.getEventStore({
      data: function () {
        const events = [];

        for (let endD, endH, startD, startH, i = 1; i <= 7; i++) {
          [startD, startH, endD, endH] = stairStepEvent(i);
          events.push({
            id: i,
            cls: 'event' + i,
            resourceId: 'r' + i,
            name: 'Assignment ' + i,
            startDate: new Date(2011, 0, 1 + startD, startH),
            endDate: new Date(2011, 0, 1 + endD, endH),
            iconCls: iconClasses[i]
          });
        }

        return events;
      }()
    });
    resourceStore = t.getResourceStore({
      data: [{
        id: 'r1',
        name: 'Mike',
        eventColor: 'red'
      }, {
        id: 'r2',
        name: 'Linda',
        eventColor: 'orange'
      }, {
        id: 'r3',
        name: 'Don',
        eventColor: '#f1c114'
      }, {
        id: 'r4',
        name: 'Karen',
        eventColor: 'green'
      }, {
        id: 'r5',
        name: 'Doug',
        eventColor: 'blue'
      }, {
        id: 'r6',
        name: 'Peter',
        eventColor: 'indigo'
      }]
    });
    dayView = await getDayView(t, {
      eventStore,
      resourceStore,
      startDate: new Date(2011, 0, 2),
      endDate: new Date(2011, 0, 9)
    });
    t.is(dayView.eventElements.length, 7, 'Correct number of event elements');
    t.is(dayView.allDayEvents.weekLength, 7, 'Correct number of all day event elements');
    t.selectorCountIs(`.b-dayview-day-container .${dayView.dayCellCls}`, 7);
    t.hasCls(dayView.dayContainerElement.children[0], 'b-nonworking-day');
    t.hasCls(dayView.dayContainerElement.children[0], 'b-weekend');
    t.hasCls(dayView.dayContainerElement.children[6], 'b-nonworking-day');
    t.hasCls(dayView.dayContainerElement.children[6], 'b-weekend');
    dayView.hideNonWorkingDays = true;
    t.is(dayView.eventElements.length, 5, 'Correct number of event elements');
    t.is(dayView.allDayEvents.weekLength, 5, 'Correct number of all day event elements');
    t.selectorCountIs(`.b-dayview-day-container .${dayView.dayCellCls}`, 5);
    t.selectorNotExists('.b-calendar-cell.b-nonworking-day');
    t.selectorNotExists('.b-calendar-cell.b-weekend');
    dayView.hideNonWorkingDays = false;
    t.is(dayView.eventElements.length, 7, 'Correct number of event elements');
    t.is(dayView.allDayEvents.weekLength, 7, 'Correct number of all day event elements');
    t.selectorCountIs(`.b-dayview-day-container .${dayView.dayCellCls}`, 7);
    t.hasCls(dayView.dayContainerElement.children[0], 'b-nonworking-day');
    t.hasCls(dayView.dayContainerElement.children[0], 'b-weekend');
    t.hasCls(dayView.dayContainerElement.children[6], 'b-nonworking-day');
    t.hasCls(dayView.dayContainerElement.children[6], 'b-weekend');
  });
  t.it('Events at visible limits on DST in US', async t => {
    eventStore = t.getEventStore({
      data: [{
        id: 'e1',
        cls: 'cell-0',
        resourceId: 'r1',
        name: 'Cell 0',
        startDate: new Date(2010, 10, 1, 19),
        endDate: new Date(2010, 10, 1, 20)
      }, {
        id: 'e2',
        cls: 'cell-35',
        resourceId: 'r1',
        name: 'Cell 35',
        startDate: new Date(2010, 10, 7, 19),
        endDate: new Date(2010, 10, 7, 20) // Nov 7, 2010 is DST day in US

      }]
    });
    resourceStore = t.getResourceStore({
      data: [{
        id: 'r1',
        name: 'Mike',
        eventColor: 'red'
      }]
    });
    dayView = await getDayView(t, {
      eventStore,
      resourceStore,
      startDate: new Date(2010, 10, 1),
      endDate: new Date(2010, 10, 8)
    });
    const eventElements = dayView.bodyElement.querySelectorAll('.b-cal-event-wrap');
    t.is(eventElements.length, 2, '2 event start elements'); // We should only have gathered cells for the view's own cells

    t.is(dayView.cellMap.size, 2, 'Correct number of events');
  });
  t.it('Events at visible limits on DST in CET', async t => {
    eventStore = t.getEventStore({
      data: [{
        id: 'e1',
        cls: 'cell-0',
        resourceId: 'r1',
        name: 'Cell 0',
        startDate: new Date(2010, 9, 27, 9),
        endDate: new Date(2010, 9, 27, 10)
      }, {
        id: 'e2',
        cls: 'cell-35',
        resourceId: 'r1',
        name: 'Cell 35',
        startDate: new Date(2010, 9, 31, 9),
        endDate: new Date(2010, 9, 31, 10) // Oct 31, 2010 is DST day in CET TZ

      }]
    });
    resourceStore = t.getResourceStore({
      data: [{
        id: 'r1',
        name: 'Mike',
        eventColor: 'red'
      }]
    });
    dayView = await getDayView(t, {
      width: 1000,
      height: 750,
      startDate: new Date(2010, 9, 25),
      endDate: new Date(2010, 10, 1),
      eventStore,
      resourceStore
    });
    const eventElements = dayView.bodyElement.querySelectorAll('.b-cal-event-wrap');
    t.is(eventElements.length, 2, '2 event start elements'); // We should only have gathered cells for the view's own cells

    t.is(dayView.cellMap.size, 2);
  });
  t.it('Adding new events', async t => {
    dayView = await getDayView(t, {
      dayStartTime: 20
    });
    const {
      allDayEvents
    } = dayView;
    await t.waitFor(() => dayView.allDayEvents.element.querySelectorAll('.b-cal-event-wrap:not(.b-overflow)').length === 5);
    const allDayHeight = dayView.allDayEvents.height,
          shifter = t.dateShifter(18);
    dayView.eventStore.add([{
      startDate: shifter(2019, 10, 14),
      endDate: shifter(2019, 10, 19),
      name: 'Work week'
    }, {
      startDate: shifter(2019, 10, 19),
      endDate: shifter(2019, 10, 21),
      name: 'The weekend'
    }, {
      startDate: shifter(2019, 10, 1),
      endDate: shifter(2019, 10, 31),
      name: 'Very long event'
    }]);
    await t.waitForEvent(dayView, 'refresh');
    await t.waitFor(() => t.samePx(allDayEvents.element.offsetHeight, allDayEvents.cellContentHeight + allDayEvents.headerCellContainer.offsetHeight));
    t.selectorCountIs(`#${dayView.allDayEvents.id} .b-cal-event-wrap:not(.b-overflow)`, 2, 'only 2 long running events visible');
    t.selectorCountIs('.b-cal-cell-overflow:contains(+2 more)', 4);
    t.selectorCountIs('.b-cal-cell-overflow:contains(+1 more)', 3);
    await t.waitForAnimations();
    t.isGreater(dayView.allDayEvents.height, allDayHeight);
    const collapsedAllDayHeight = dayView.allDayEvents.height;
    await t.click('.b-expand-allday-button');
    await t.waitFor(() => t.samePx(allDayEvents.element.offsetHeight, allDayEvents.cellContentHeight + allDayEvents.headerCellContainer.offsetHeight));
    t.selectorCountIs(`#${dayView.allDayEvents.id} .b-cal-event-wrap:not(.b-overflow)`, 8, '8 long running events visible');
    t.isGreater(dayView.allDayEvents.height, collapsedAllDayHeight);
    await t.click('.b-expand-allday-button');
    await t.waitFor(() => Math.abs(dayView.allDayEvents.height - collapsedAllDayHeight) <= 2);
    t.diag(`${dayView.allDayEvents.height}, ${collapsedAllDayHeight}`);
  });
  t.it('Events which end at EOD must not be in the all day region', async t => {
    dayView = await getDayView(t, {
      eventStore: {
        data: [{
          name: 'Late dinner',
          resourceId: 'bryntum',
          startDate: '2019-10-15T12:00:00',
          endDate: '2019-10-15T18:00:00'
        }]
      }
    }); // Wait for layout to be correct

    await t.waitForAnimationFrame();
    t.selectorNotExists('.b-calendarrow .b-cal-event-wrap.b-allday:contains(Late dinner)', 'Event is correctly not in all day zone');
    t.selectorCountIs('.b-dayview .b-dayview-day-container .b-cal-event-wrap:contains(Late dinne)', 1, 'Event is in day detail zone');
  });
  t.it('Events which end at EOD must not be in the all day region when dayStartTime/dayEndTime is used', async t => {
    dayView = await getDayView(t, {
      dayStartTime: 20,
      dayEndTime: 16,
      eventStore: {
        data: [{
          name: 'Late dinner',
          resourceId: 'bryntum',
          startDate: '2019-10-15T12:00:00',
          endDate: '2019-10-15T18:00:00'
        }]
      }
    }); // Wait for layout to be correct

    await t.waitForAnimationFrame(); // It's not allDay or interDay

    t.selectorNotExists('.b-calendarrow .b-cal-event-wrap.b-allday:contains(Late dinner)', 'Event is correctly not in all day zone');
    t.selectorCountIs('.b-dayview .b-dayview-day-container .b-cal-event-wrap:contains(Late dinne)', 1, 'Event is in day detail zone');
  });
  t.it('Background lines must end at EOD', async t => {
    dayView = await getDayView(t, {
      height: 768,
      width: 1024,
      eventStore: {
        data: []
      },
      hourHeight: 40,
      dayStartTime: 20,
      dayEndTime: 3
    }); // Wait for layout to be correct

    await t.waitForAnimationFrame();
    const dayHeight = dayView.hourHeight * 7,
          p = DomHelper.getStyleValue(dayView.dayContainerElement, 'clip-path');
    t.is(p, `polygon(0px 0px, 100% 0px, 100% ${dayHeight}px, 0px ${dayHeight}px)`, 'Day container element clipped correctly');
  });
  t.it('Changing event startDate should work', async t => {
    dayView = await getDayView(t, {
      endDate: '2019-10-21',
      timeFormat: 'H A',
      eventStore: {
        data: [{
          name: 'Breakfast',
          resourceId: 'bryntum',
          startDate: '2019-10-15T20:00:00',
          endDate: '2019-10-15T21:00:00'
        }, {
          name: 'Lunch',
          resourceId: 'bryntum',
          startDate: '2019-10-16T01:00:00',
          endDate: '2019-10-16T02:00:00'
        }, {
          name: 'Dinner',
          resourceId: 'bryntum',
          startDate: '2019-10-16T03:00:00',
          endDate: '2019-10-16T05:00:00'
        }]
      }
    });
    const mondayCell = dayView.getDayElement('2019-10-14'),
          tuesdayCell = dayView.getDayElement('2019-10-15'),
          breakfast = dayView.eventStore.first,
          lunch = dayView.eventStore.getAt(1),
          dinner = dayView.eventStore.last;
    t.selectorCountIs('.b-cal-event-wrap', 3, 'Three events are rendered'); // The dinner element is in the correct order. It's the last one.

    t.is(dayView.getEventElement(dinner), tuesdayCell.children[2]);
    let prom = t.waitForEvent(dayView, 'refresh'); // Move to start before breakfast

    dinner.startDate = new Date(2019, 9, 15, 3, 30);
    await prom;
    t.selectorCountIs('.b-cal-event-wrap', 3, 'Three events are rendered');
    t.is(dayView.getEventElement(dinner), mondayCell.firstElementChild, 'Dinner element moved');
    t.is(mondayCell.childNodes.length, 1, 'Monday has 1 event'); // The breakfast element is in the correct cell

    t.is(dayView.getEventElement(breakfast), tuesdayCell.firstElementChild);
    t.is(dayView.getEventElement(lunch), tuesdayCell.children[1]);
    t.is(tuesdayCell.childNodes.length, 2, 'Tuesday has 2 events'); // Move to previous day

    prom = t.waitForEvent(dayView, 'refresh');
    breakfast.startDate = new Date(2019, 9, 14, 20, 30);
    await prom;
    t.selectorCountIs('.b-cal-event-wrap', 3, 'Three events are rendered');
    t.is(dayView.getEventElement(breakfast), mondayCell.firstElementChild, 'Breakfast element moved');
    t.is(dayView.getEventElement(dinner), mondayCell.children[1], 'Dinner element moved');
    t.is(mondayCell.childNodes.length, 2, 'Monday has 2 events');
    t.is(dayView.getEventElement(lunch), tuesdayCell.firstElementChild, 'Lnch element remains');
    t.is(tuesdayCell.childNodes.length, 1, 'Tuesday has last event');
  });
  t.it('Simple Features on standalone CalendarMixin widget', async t => {
    dayView = await getDayView(t, {
      features: {
        eventTooltip: true,
        eventEdit: true,
        drag: true
      }
    });
    await t.click('.b-cal-event-wrap[data-event-id="5"]');
    await t.waitForSelector('.b-sch-event-tooltip:contains(Breakfast)');
    await t.click('.b-sch-event-tooltip button[data-ref="edit"]');
    await t.waitFor(() => {
      var _dayView$features$eve;

      return (_dayView$features$eve = dayView.features.eventEdit.editor) === null || _dayView$features$eve === void 0 ? void 0 : _dayView$features$eve.containsFocus;
    });
    await t.type(null, 'Petit déjeuner', null, null, null, true);
    await t.click('.b-eventeditor [data-ref="saveButton"]');
    await t.click('.b-sch-recurrenceconfirmation button[data-ref="changeMultipleButton"]');
    await t.waitForSelector('.b-cal-event-wrap:contains(Petit déjeuner)');
    t.selectorCountIs('.b-cal-event-wrap:contains(Petit déjeuner)', 6, 'Correct number of event elements');
  });
  t.it('DayView should intercept scrollTo calls to its allDayEvents', async t => {
    dayView = await getDayView(t, {
      features: {
        eventTooltip: true,
        eventEdit: true,
        drag: true
      }
    });
    await dayView.scrollTo('2019-06-17');
    t.selectorExists('.b-dayview-allday.b-calendar-cell[data-date="2019-06-17"', 'All day has navigated');
    t.selectorExists('.b-dayview-day-detail[data-date="2019-06-17"', 'DayView has navigated');
  });
  t.it('should handle drag/drop', async t => {
    calendar = await t.getCalendar({
      date: new Date(2021, 2, 27),
      events: [{
        id: 1,
        name: 'Event',
        startDate: new Date(2021, 2, 23, 1),
        endDate: new Date(2021, 2, 23, 3)
      }],
      modes: {
        day: null,
        week: {
          dayStartShift: 18,
          dayStartTime: 20,
          dayEndTime: 10,
          eventSpacing: 0
        },
        month: null,
        year: null,
        agenda: null
      },
      sidebar: null
    });
    const event = calendar.eventStore.first,
          dayPx = calendar.modes.week.dayContainerElement.querySelector('.b-dayview-day-detail').offsetWidth,
          hourPx = calendar.modes.week.hourHeight;
    await t.waitForSelector('.b-dayview-timeaxis-time:first-child:contains(9 PM)'); // https://github.com/bryntum/support/issues/3942

    t.selectorCountIs('.b-cal-cell-header', 7);
    t.selectorCountIs('.b-dayview-allday.b-calendar-cell', 7);
    t.selectorCountIs('.b-dayview-day-container .b-calendar-cell', 7);
    await t.dragBy('.b-cal-event', [dayPx, 0]);
    t.is(event.startDate, new Date(2021, 2, 24, 1), 'Event moved one day right');
    await t.dragBy('.b-cal-event', [0, 2 * hourPx]);
    t.is(event.startDate, new Date(2021, 2, 24, 3), 'Event moved down');
    await t.dragBy('.b-cal-event', [0, -4.25 * hourPx]);
    t.is(event.startDate, new Date(2021, 2, 23, 22, 45), 'Event moved up through midnight');
    await t.dragBy('.b-cal-event', [-dayPx, 0]);
    t.is(event.startDate, new Date(2021, 2, 22, 22, 45), 'Event moved left one day');
    await t.dragBy('.b-cal-event', [0, -1.75 * hourPx]);
    t.is(event.startDate, new Date(2021, 2, 22, 21), 'Event moved up above midnight');
    await t.moveCursorTo('.b-cal-event', () => {}, null, ['50%', '100%-3']); // make resizer appear

    await t.dragBy('.b-gripper-horz', [0, 2 * hourPx + 3]);
    t.is(event.startDate, new Date(2021, 2, 22, 21), 'Event resized by 2 hrs on the end has same startDate');
    t.is(event.endDate, new Date(2021, 2, 23, 1), 'Event resized by 2 hrs on the end has correct endDate');
    await t.dragBy('.b-dayview-day-detail[data-date="2021-03-23"]', [2 * dayPx, 4 * hourPx], null, null, null, false, ['50%', 2 * hourPx]);
    await t.click('[data-ref="nameField"] input');
    await t.type(null, 'Derp');
    await t.click('button:contains(Save)');
    const event2 = calendar.eventStore.last;
    t.is(event2.name, 'Derp', 'New event has correct name');
    t.is(event2.startDate, new Date(2021, 2, 23, 22), 'New event has correct startDate');
    t.is(event2.endDate, new Date(2021, 2, 26, 2), 'New event has correct endDate');
  });
  t.it('should handle drag create', async t => {
    calendar = await t.getCalendar({
      date: new Date(2021, 2, 27),
      events: [],
      modes: {
        day: null,
        week: {
          dayStartShift: 18,
          dayStartTime: 18,
          visibleStartTime: 18
        },
        month: null,
        year: null,
        agenda: null
      },
      sidebar: null
    });
    const hourPx = calendar.modes.week.hourHeight;
    await t.dragBy('.b-dayview-day-detail[data-date="2021-03-23"]', [0, 6 * hourPx], null, null, null, true, ['50%', 2 * hourPx]); // This is not a day spanning event. It's within our logical day

    t.selectorCountIs('.b-cal-tentative-event', 1);
  });
  t.it('showAllDayHeader : false', async t => {
    dayView = await getDayView(t, {
      showAllDayHeader: false,
      dayStartShift: 18,
      visibleStartTime: 18,
      startDate: '2021-12-12',
      endDate: '2021-12-19'
    }, {
      resources: {
        rows: [{
          id: 'Nige',
          name: 'Nige'
        }]
      },
      events: {
        rows: [{
          id: 1,
          resourceId: 1,
          name: 'All Monday',
          startDate: '2021-12-13T18:00',
          endDate: '2021-12-14T18:00'
        }, {
          id: 2,
          resourceId: 1,
          name: '11PM Tue-11PM Thu',
          startDate: '2021-12-14T23:00',
          endDate: '2021-12-16T23:00'
        }, {
          id: 3,
          resourceId: 1,
          name: 'allDay Fri-Sat',
          startDate: '2021-12-18',
          endDate: '2021-12-18',
          allDay: true
        }, {
          id: 4,
          resourceId: 1,
          name: 'Within Sunday',
          startDate: '2021-12-18T23:00',
          endDate: '2021-12-19T01:00'
        }]
      }
    }); // Wait for layout to be correct

    await ready(t);
    let eventEl = dayView.getEventElement(1);
    t.is(eventEl.style.top, '0%');
    t.is(eventEl.style.height, '100%');
    t.hasNotCls(eventEl, 'b-starts-above');
    t.hasNotCls(eventEl, 'b-ends-below');
    eventEl = dayView.getEventElement(2, '2021-12-14');
    t.is(eventEl.style.top, '20.83%');
    t.is(eventEl.style.height, '79.17%');
    t.hasNotCls(eventEl, 'b-starts-above');
    t.hasCls(eventEl, 'b-ends-below');
    eventEl = dayView.getEventElement(2, '2021-12-15');
    t.is(eventEl.style.top, '0%');
    t.is(eventEl.style.height, '100%');
    t.hasCls(eventEl, 'b-starts-above');
    t.hasCls(eventEl, 'b-ends-below');
    eventEl = dayView.getEventElement(2, '2021-12-16');
    t.is(eventEl.style.top, '0%');
    t.is(eventEl.style.height, '20.83%');
    t.hasCls(eventEl, 'b-starts-above');
    t.hasNotCls(eventEl, 'b-ends-below');
    eventEl = dayView.getEventElement(3);
    t.is(eventEl.style.top, '0%');
    t.is(eventEl.style.height, '100%');
    t.hasNotCls(eventEl, 'b-starts-above');
    t.hasNotCls(eventEl, 'b-ends-below');
    eventEl = dayView.getEventElement(4);
    t.is(eventEl.style.top, '20.83%');
    t.is(eventEl.style.height, '8.34%');
    t.hasNotCls(eventEl, 'b-starts-above');
    t.hasNotCls(eventEl, 'b-ends-below');
  });
});