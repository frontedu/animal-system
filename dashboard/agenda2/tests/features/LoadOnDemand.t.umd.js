"use strict";

StartTest(t => {
  // eslint-disable-next-line no-unused-vars
  let calendar;

  async function getCalendar(config) {
    const calendar = await t.getCalendar(config);
    return calendar;
  }

  t.beforeEach(function () {
    var _calendar;

    (_calendar = calendar) === null || _calendar === void 0 ? void 0 : _calendar.destroy();
  });
  t.mockUrl('events', {
    delay: 100,
    responseText: JSON.stringify({
      success: true,
      events: {
        rows: [{
          id: 1,
          duration: 1,
          durationUnit: 'hour',
          name: 'Meeting',
          startDate: new Date(2019, 9, 15, 13)
        }]
      },
      resources: {
        rows: []
      }
    })
  });
  t.it('Should trigger load after changing date range', async t => {
    calendar = await t.getCalendar({
      date: new Date(2019, 9, 14),
      sidebar: false,
      mode: 'week',
      features: {
        loadOnDemand: true
      },
      crudManager: {
        transport: {
          load: {
            url: 'events',
            params: {
              credentials: 'user/password'
            }
          }
        }
      }
    });
    await t.waitForSelector('.b-cal-event');
    t.firesOnce(calendar.crudManager, 'beforeSend');
    t.firesOnce(calendar.crudManager, 'load');
    calendar.crudManager.on('beforeSend', ({
      params
    }) => {
      t.is(params.credentials, 'user/password');
      t.is(params.startDate, '2019-10-20');
      t.is(params.endDate, '2019-10-27');
    });
    calendar.shiftNext();
    await t.waitForEvent(calendar.crudManager, 'load');
  }); // https://github.com/bryntum/support/issues/3162

  t.it('Should support disabling feature', async t => {
    calendar = await t.getCalendar({
      date: new Date(2019, 9, 14),
      sidebar: false,
      mode: 'week',
      features: {
        loadOnDemand: true
      },
      crudManager: {
        transport: {
          load: {
            url: 'events'
          }
        },
        autoLoad: true
      }
    });
    calendar.features.loadOnDemand.disabled = true;
    await t.waitForSelector('.b-cal-event');
    const spy = t.spyOn(calendar.crudManager, 'load');
    calendar.shiftNext();
    t.expect(spy).not.toHaveBeenCalled();
  });
  t.it('Dynamically loaded events', async t => {
    // The events must have been normalized by the engine for the mockUrl
    // "server" to filter them using correct startDate and endDate
    const serverCalendar = await getCalendar({
      date: new Date(2019, 9, 14),
      eventStore: {
        data: t.getHackathonData().events.rows
      },
      resourceStore: {
        data: t.getHackathonData().resources.rows
      },
      style: {
        position: 'absolute',
        top: '-10000px'
      },
      modes: {
        day: null,
        week: null,
        month: true,
        year: null,
        agenda: null
      }
    }),
          sourceRecords = serverCalendar.eventStore.records.slice();
    serverCalendar.destroy();
    t.mockUrl('test-dynamic-load', (url, urlParams, {
      queryParams
    }) => {
      const resources = t.getHackathonData().resources.rows,
            startDate = DateHelper.parseKey(queryParams.startDate),
            endDate = DateHelper.parseKey(queryParams.endDate),
            events = startDate && endDate ? sourceRecords.filter(e => {
        return DateHelper.intersectSpans(e.startDate, e.endDate, startDate, endDate);
      }).map(r => r.data) : [];
      return {
        delay: 100,
        responseText: JSON.stringify({
          success: true,
          resources: {
            rows: resources
          },
          events: {
            rows: events
          }
        })
      };
    });
    calendar = await getCalendar({
      sidebar: false,
      crudManager: {
        transport: {
          load: {
            url: 'test-dynamic-load'
          }
        },
        autoLoad: false,
        autoSync: false
      },
      date: new Date(2019, 9, 14),
      mode: 'day',
      features: {
        loadOnDemand: true
      }
    });
    let lastRefreshCount;
    t.chain({
      waitFor: () => calendar.eventStore.count === 4 && document.querySelectorAll('.b-calendarrow .b-cal-event-wrap').length === 2
    }, // 14/10/2019 has four events in total
    next => {
      t.selectorCountIs('.b-calendarrow .b-cal-event-wrap', 2);
      t.selectorCountIs('.b-dayview-day-container .b-cal-event-wrap', 2);
      lastRefreshCount = calendar.activeView.refreshCount;
      next();
    }, // Go to previous day. There are no events.
    // There must be TWO refreshes. One when the initial refresh is triggered
    // which triggers the server data request, and then one when the data arrives
    {
      waitFor: () => calendar.activeView.refreshCount === lastRefreshCount + 2,
      trigger: {
        click: () => calendar.widgetMap.prevButton.element
      }
    }, next => {
      t.is(calendar.eventStore.count, 0);
      t.selectorCountIs('.b-cal-event-wrap', 0);
      lastRefreshCount = calendar.activeView.refreshCount;
      next();
    }, // Return to the 14th
    {
      waitFor: () => calendar.activeView.refreshCount === lastRefreshCount + 2,
      trigger: {
        click: () => calendar.widgetMap.nextButton.element
      }
    }, // Back at 14/10/2019 which has four events in total
    next => {
      t.is(calendar.eventStore.count, 4);
      t.selectorCountIs('.b-calendarrow .b-cal-event-wrap', 2);
      t.selectorCountIs('.b-dayview-day-container .b-cal-event-wrap', 2);
      lastRefreshCount = calendar.activeView.refreshCount;
      next();
    }, // Go to the 15th
    {
      waitFor: () => calendar.activeView.refreshCount === lastRefreshCount + 2,
      trigger: {
        click: () => calendar.widgetMap.nextButton.element
      }
    }, // Now at 15/10/2019 which has seven events in total
    next => {
      t.is(calendar.eventStore.count, 7);
      t.selectorCountIs('.b-calendarrow .b-cal-event-wrap', 1);
      t.selectorCountIs('.b-dayview-day-container .b-cal-event-wrap', 6);
      lastRefreshCount = calendar.activeView.refreshCount;
      next();
    }, // Go back to the 14th
    // There must be TWO refreshes. One when the initial refresh is triggered
    // which triggers the server data request, and then one when the data arrives
    {
      waitFor: () => calendar.activeView.refreshCount === lastRefreshCount + 2,
      trigger: {
        click: () => calendar.widgetMap.prevButton.element
      }
    }, // Back at 14/10/2019 which has four events in total
    next => {
      t.is(calendar.eventStore.count, 4);
      t.selectorCountIs('.b-calendarrow .b-cal-event-wrap', 2);
      t.selectorCountIs('.b-dayview-day-container .b-cal-event-wrap', 2);
      lastRefreshCount = calendar.modes.week.refreshCount || 0;
      next();
    }, // Go to Week 42, October 2019
    {
      waitForEvent: [calendar, 'activeItemChange'],
      trigger: {
        click: () => calendar.widgetMap.weekShowButton.element
      }
    }, // Now at Week 42, October 2019 which has 23 events in total
    next => {
      t.is(calendar.eventStore.count, 23);
      t.selectorCountIs('.b-calendarrow .b-cal-event-wrap', calendar.activeView.element, 9); // Note: event count and element count both being 23 is a coincidence.
      // There are 4 all day events which won't be in the day-container
      // But there are 4 occurrences which makes the element count 23.

      t.selectorCountIs('.b-dayview-day-container .b-cal-event-wrap', calendar.activeView.element, 23);
      lastRefreshCount = calendar.activeView.refreshCount || 0;
      next();
    }, // Go to previous week. There are no events.
    // There must be TWO refreshes. One when the initial refresh is triggered
    // which triggers the server data request, and then one when the data arrives
    {
      waitFor: () => calendar.activeView.refreshCount === lastRefreshCount + 2,
      trigger: {
        click: () => calendar.widgetMap.prevButton.element
      }
    }, next => {
      t.is(calendar.eventStore.count, 0);
      t.selectorCountIs('.b-cal-event-wrap', calendar.activeView.element, 0);
      lastRefreshCount = calendar.activeView.refreshCount;
      next();
    }, // Go back to Week 42, October 2019
    {
      waitFor: () => calendar.activeView.refreshCount === lastRefreshCount + 2,
      trigger: {
        click: () => calendar.widgetMap.nextButton.element
      }
    }, // Now at Week 42, October 2019 which has 23 events in total
    next => {
      t.is(calendar.eventStore.count, 23);
      t.selectorCountIs('.b-calendarrow .b-cal-event-wrap', calendar.activeView.element, 9); // Note: event count and element count both being 23 is a coincidence.
      // There are 4 all day events which won't be in the day-container
      // But there are 4 occurrences which makes the element count 23.

      t.selectorCountIs('.b-dayview-day-container .b-cal-event-wrap', calendar.activeView.element, 23);
      lastRefreshCount = calendar.activeView.refreshCount || 0;
      next();
    }, // Go to October 2019
    {
      waitForEvent: [calendar, 'activeItemChange'],
      trigger: {
        click: () => calendar.widgetMap.monthShowButton.element
      }
    }, // Now at October 2019 which has 27 events in total
    next => {
      t.is(calendar.eventStore.count, 27);
      t.selectorCountIs('.b-cal-event-wrap', calendar.activeView.element, 16);
      t.selectorCountIs('.b-cal-cell-overflow', calendar.activeView.element, 7);
      lastRefreshCount = calendar.activeView.refreshCount || 0;
      next();
    }, // Go to previous month. There are no events.
    // There must be TWO refreshes. One when the initial refresh is triggered
    // which triggers the server data request, and then one when the data arrives
    {
      waitFor: () => calendar.activeView.refreshCount === lastRefreshCount + 2,
      trigger: {
        click: () => calendar.widgetMap.prevButton.element
      }
    }, next => {
      t.is(calendar.eventStore.count, 0);
      t.selectorCountIs('.b-cal-event-wrap', calendar.activeView.element, 0);
      t.selectorCountIs('.b-cal-cell-overflow', calendar.activeView.element, 0);
      lastRefreshCount = calendar.activeView.refreshCount;
      next();
    }, // Go back to October 2019
    {
      waitFor: () => calendar.activeView.refreshCount === lastRefreshCount + 2,
      trigger: {
        click: () => calendar.widgetMap.nextButton.element
      }
    }, // Now back at October 2019 which has 27 events in total
    next => {
      t.is(calendar.eventStore.count, 27);
      t.selectorCountIs('.b-cal-event-wrap', calendar.activeView.element, 16);
      t.selectorCountIs('.b-cal-cell-overflow', calendar.activeView.element, 7);
      lastRefreshCount = calendar.activeView.refreshCount || 0;
      next();
    }, // Go to 2019
    {
      waitForEvent: [calendar, 'activeItemChange'],
      trigger: {
        click: () => calendar.widgetMap.yearShowButton.element
      }
    }, // Now at 2019 which has 27 events and 8 event-bearing days in total
    next => {
      t.is(calendar.eventStore.count, 27);
      t.selectorCountIs('.b-cal-cell-overflow', calendar.activeView.element, 8);
      t.selectorCountIs('.b-datepicker-1-to-3-events', calendar.activeView.element, 1);
      t.selectorCountIs('.b-datepicker-4-to-6-events', calendar.activeView.element, 5);
      t.selectorCountIs('.b-calendar-7-or-more-events', calendar.activeView.element, 2);
      lastRefreshCount = calendar.activeView.refreshCount || 0;
      next();
    }, // Go to previous year. There are no events.
    // There must be TWO refreshes. One when the initial refresh is triggered
    // which triggers the server data request, and then one when the data arrives
    {
      waitFor: () => calendar.activeView.refreshCount === lastRefreshCount + 2,
      trigger: {
        click: () => calendar.widgetMap.prevButton.element
      }
    }, next => {
      t.is(calendar.eventStore.count, 0);
      t.selectorCountIs('.b-cal-cell-overflow', calendar.activeView.element, 0);
      t.selectorCountIs('.b-datepicker-1-to-3-events', calendar.activeView.element, 0);
      t.selectorCountIs('.b-datepicker-4-to-6-events', calendar.activeView.element, 0);
      t.selectorCountIs('.b-calendar-7-or-more-events', calendar.activeView.element, 0);
      lastRefreshCount = calendar.activeView.refreshCount || 0;
      next();
    }, // Go back to 2019
    {
      waitFor: () => calendar.activeView.refreshCount === lastRefreshCount + 2,
      trigger: {
        click: () => calendar.widgetMap.nextButton.element
      }
    }, // Now back at 2019 which has 27 events and 8 event-bearing days in total
    next => {
      t.is(calendar.eventStore.count, 27);
      t.selectorCountIs('.b-cal-cell-overflow', calendar.activeView.element, 8);
      t.selectorCountIs('.b-datepicker-1-to-3-events', calendar.activeView.element, 1);
      t.selectorCountIs('.b-datepicker-4-to-6-events', calendar.activeView.element, 5);
      t.selectorCountIs('.b-calendar-7-or-more-events', calendar.activeView.element, 2);
      lastRefreshCount = calendar.activeView.refreshCount || 0;
      next();
    }, {
      waitForEvent: [calendar, 'activeItemChange'],
      trigger: {
        click: () => calendar.widgetMap.dayShowButton.element
      }
    }, // Now at 14/10/2019 which has 4 events in total
    next => {
      t.is(calendar.eventStore.count, 4);
      t.selectorCountIs('.b-calendarrow .b-cal-event-wrap', calendar.activeView.element, 2);
      t.selectorCountIs('.b-dayview-day-container .b-cal-event-wrap', calendar.activeView.element, 2);
      next();
    }, {
      waitForEvent: [calendar, 'activeItemChange'],
      trigger: {
        click: () => calendar.widgetMap.agendaShowButton.element
      }
    }, // Now in Agenda View
    next => {
      t.is(calendar.eventStore.count, 27);
      t.selectorCountIs('.b-cal-event-wrap', calendar.activeView.element, 39);
      t.selectorCountIs('.b-calendar-cell', calendar.activeView.element, 8);
      next();
    });
  }); // https://github.com/bryntum/support/issues/4063

  t.it('autoRowHeight in MonthView', async t => {
    // The events must have been normalized by the engine for the mockUrl
    // "server" to filter them using correct startDate and endDate
    const serverCalendar = await getCalendar({
      date: new Date(2019, 9, 14),
      eventStore: {
        data: t.getHackathonData().events.rows.concat([{
          id: 1000,
          startDate: new Date(2019, 10, 14),
          endDate: new Date(2019, 10, 22),
          name: 'Holiday 2019',
          allDay: true,
          resourceId: 'bryntum'
        }])
      },
      resourceStore: {
        data: t.getHackathonData().resources.rows
      },
      style: {
        position: 'absolute',
        top: '-10000px'
      },
      modes: {
        day: null,
        week: null,
        month: true,
        year: null,
        agenda: null
      }
    }),
          sourceRecords = serverCalendar.eventStore.records.slice();
    serverCalendar.destroy();
    t.mockUrl('test-date-range-recursion', (url, urlParams, {
      queryParams
    }) => {
      const resources = t.getHackathonData().resources.rows,
            startDate = DateHelper.parseKey(queryParams.startDate),
            endDate = DateHelper.parseKey(queryParams.endDate),
            events = startDate && endDate ? sourceRecords.filter(e => {
        return DateHelper.intersectSpans(e.startDate, e.endDate, startDate, endDate);
      }).map(r => r.data) : [];
      return {
        delay: 100,
        responseText: JSON.stringify({
          success: true,
          resources: {
            rows: resources
          },
          events: {
            rows: events
          }
        })
      };
    });
    calendar = await getCalendar({
      sidebar: false,
      crudManager: {
        transport: {
          load: {
            url: 'test-date-range-recursion'
          }
        },
        autoLoad: false,
        autoSync: false
      },
      date: new Date(2019, 9, 14),
      mode: 'month',
      features: {
        loadOnDemand: true
      },
      modes: {
        day: null,
        month: {
          autoRowHeight: true,
          minRowHeight: '4ev'
        }
      }
    });
    let dateRangeChangeCount = 0;
    calendar.on({
      dateRangeChange() {
        if (++dateRangeChangeCount > 1) {
          if (dateRangeChangeCount === 2) {
            t.fail('dateRangeChange loop entered.');
          }

          calendar.modes.month._cellMap = calendar.modes.week.cellMap;
          return false;
        }
      },

      prio: 100000
    });
    await t.click('button[data-ref="weekShowButton"]'); // Wait for a successful load of the week's data, then also for the recursion bug to manifest.

    await t.waitFor(1000);
  }); // https://github.com/bryntum/support/issues/3469

  t.it('With a Scheduler as a mode', async t => {
    // The events must have been normalized by the engine for the mockUrl
    // "server" to filter them using correct startDate and endDate
    const serverCalendar = await getCalendar({
      date: new Date(2019, 9, 14),
      eventStore: {
        data: t.getHackathonData().events.rows.concat([{
          id: 1000,
          startDate: new Date(2019, 10, 14),
          endDate: new Date(2019, 10, 22),
          name: 'Holiday 2019',
          allDay: true,
          resourceId: 'bryntum'
        }])
      },
      resourceStore: {
        data: t.getHackathonData().resources.rows
      },
      style: {
        position: 'absolute',
        top: '-10000px'
      },
      modes: {
        day: null,
        week: null,
        month: true,
        year: null,
        agenda: null
      }
    }),
          sourceRecords = serverCalendar.eventStore.records.slice(),
          datesRequested = [];
    serverCalendar.destroy();
    t.mockUrl('test-scheduler-as-a-mode', (url, urlParams, {
      queryParams
    }) => {
      const resources = t.getHackathonData().resources.rows,
            startDate = DateHelper.parseKey(queryParams.startDate),
            endDate = DateHelper.parseKey(queryParams.endDate),
            events = startDate && endDate ? sourceRecords.filter(e => {
        return DateHelper.intersectSpans(e.startDate, e.endDate, startDate, endDate);
      }).map(r => r.data) : [];
      datesRequested.push([queryParams.startDate, queryParams.endDate]);
      return {
        delay: 100,
        responseText: JSON.stringify({
          success: true,
          resources: {
            rows: resources
          },
          events: {
            rows: events
          }
        })
      };
    });
    calendar = await getCalendar({
      sidebar: false,
      crudManager: {
        transport: {
          load: {
            url: 'test-scheduler-as-a-mode'
          }
        },
        autoLoad: true,
        autoSync: false
      },
      date: new Date(2019, 9, 14),
      features: {
        loadOnDemand: true
      },
      modes: {
        timeline: {
          type: 'scheduler',
          displayName: 'Timeline',
          features: {
            dependencies: true
          }
        }
      },
      mode: 'timeline'
    }); // The autoLoad is from the data layer which has no clue what the UI is going to be asking for

    t.isDeeply(datesRequested[0], [undefined, undefined]); // The week encapsulating the calendar's configured date has been requested

    t.isDeeply(datesRequested[1], ['2019-10-13', '2019-10-20']);
    await t.click('[data-ref="weekShowButton"]');
    await t.waitForAnimations(); // The Timeline view requested a week. The week view makes no new data requests because
    // its dataset is already present.

    t.is(datesRequested.length, 2);
    await t.click('[data-ref="monthShowButton"]');
    await t.waitForAnimations(); // The month encapsulating the calendar's configured date has been requested

    t.isDeeply(datesRequested[2], ['2019-09-29', '2019-11-10']);
    await t.click('[data-ref="timelineShowButton"]');
    await t.waitForAnimations(); // The week encapsulating the calendar's configured date has been requested

    t.isDeeply(datesRequested[3], ['2019-10-13', '2019-10-20']);
    await t.click('[data-ref="agendaShowButton"]');
    await t.waitForAnimations(); // The year encapsulating the calendar's configured date has been requested

    t.isDeeply(datesRequested[4], ['2019-01-01', '2020-01-01']); // Wait for the https://github.com/bryntum/support/issues/3469 bug to happen : spurious data loads

    await t.waitFor(500); // There must have been no more load requests than the ones tested

    t.is(datesRequested.length, 5);
  });
});