"use strict";

StartTest(t => {
  // eslint-disable-next-line no-unused-vars
  let calendar, eventStore, resourceStore;

  async function getCalendar(config) {
    const calendar = await t.getCalendar(Object.assign({}, config));
    eventStore = calendar.eventStore;
    resourceStore = calendar.resourceStore; // Wait for the DOM to have layed out so that a turbo mode mousemove triggers a mouseover

    await t.waitForAnimationFrame();
    return calendar;
  }

  t.beforeEach(function () {
    var _calendar;

    (_calendar = calendar) === null || _calendar === void 0 ? void 0 : _calendar.destroy(); // Check that none of the floating things are persisting

    if (t.query('.b-overflowpopup, .b-sch-event-tooltip, .b-eventeditor').length > 0) {
      t.selectorNotExists('.b-overflowpopup:visible');
      t.selectorNotExists('.b-sch-event-tooltip');
      t.selectorNotExists('.b-eventeditor');
    }

    t.setCursorPosition(0, 0);
  });
  t.it('Sanity', async t => {
    eventStore = new EventStore({
      // Add a recurring meeting
      data: [{
        duration: 1,
        durationUnit: 'hour',
        id: 'twice-weekly',
        name: 'Recurring Meeting',
        recurrenceRule: 'FREQ=WEEKLY;BYDAY=TU,TH',
        startDate: new Date(2019, 9, 15, 13)
      }]
    }); // eslint-disable-next-line no-undef

    resourceStore = new ResourceStore({
      data: t.getHackathonData().resources.rows
    });
    calendar = await getCalendar({
      date: new Date(2019, 9, 14),
      sidebar: false,
      eventStore,
      resourceStore,
      features: {
        eventTooltip: {
          showOn: 'hover'
        }
      },
      mode: 'month'
    });
    const rm = eventStore.first,
          {
      eventTooltip
    } = calendar.features;
    t.chain({
      moveMouseTo: '[data-date="2019-10-17"] .b-cal-event:Contains(Recurring Meeting)'
    }, {
      waitForSelector: '.b-sch-event-tooltip:contains(Recurring Meeting)'
    }, () => {
      const startTime = DateHelper.format(rm.startDate, eventTooltip.tooltip.timeFormat),
            endTime = DateHelper.format(rm.endDate, eventTooltip.tooltip.timeFormat);
      t.is(calendar.features.eventTooltip.tooltip.title, 'Recurring Meeting', 'title set correctly');
      t.selectorExists(`.b-sch-tooltip-startdate:contains(${startTime})`, 'Start date rendered correctly');
      t.selectorExists(`.b-sch-tooltip-enddate:contains(${endTime})`, 'End date rendered correctly');
      t.selectorExists('.b-cal-tooltip-recurrence:contains(Weekly on  Tuesday and  Thursday)', 'Recurrence legend correct');
    });
  });
  t.it('extendAllDayEndDay as feature config', async t => {
    eventStore = new EventStore({
      data: t.getHackathonData().events.rows
    });
    resourceStore = new ResourceStore({
      data: t.getHackathonData().resources.rows
    });
    calendar = await getCalendar({
      date: new Date(2019, 9, 14),
      sidebar: false,
      eventStore,
      resourceStore,
      features: {
        eventTooltip: {
          extendAllDayEndDay: true
        }
      },
      mode: 'week'
    });
    await t.click('.b-cal-event-wrap.b-allday:contains(Hackathon 2019)');
    await t.waitForSelector('.b-sch-event-tooltip:contains(Hackathon 2019)'); // The ending timestamp must be shown if we are using extendAllDayEndDay

    t.selectorExists('.b-sch-clock-text:contains(Oct 22, 2019)');
  });
  t.it('extendAllDayEndDay as feature tooltip config', async t => {
    eventStore = new EventStore({
      data: t.getHackathonData().events.rows
    });
    resourceStore = new ResourceStore({
      data: t.getHackathonData().resources.rows
    });
    calendar = await getCalendar({
      date: new Date(2019, 9, 14),
      sidebar: false,
      eventStore,
      resourceStore,
      features: {
        eventTooltip: {
          tooltip: {
            extendAllDayEndDay: true
          }
        }
      },
      mode: 'week'
    });
    await t.click('.b-cal-event-wrap.b-allday:contains(Hackathon 2019)');
    await t.waitForSelector('.b-sch-event-tooltip:contains(Hackathon 2019)'); // The ending timestamp must be shown if we are using extendAllDayEndDay

    t.selectorExists('.b-sch-clock-text:contains(Oct 22, 2019)');
  });
  t.it('Aborted show', async t => {
    eventStore = new EventStore({
      data: [{
        name: 'Event 1',
        startDate: new Date(2019, 9, 14),
        endDate: new Date(2019, 9, 15),
        allDay: true
      }, {
        name: 'Event 2',
        startDate: new Date(2019, 9, 14),
        endDate: new Date(2019, 9, 15),
        allDay: true
      }, {
        name: 'Event 3',
        startDate: new Date(2019, 9, 14),
        endDate: new Date(2019, 9, 15),
        allDay: true
      }, {
        name: 'Event 4',
        startDate: new Date(2019, 9, 14),
        endDate: new Date(2019, 9, 15),
        allDay: true
      }, {
        name: 'Event 5',
        startDate: new Date(2019, 9, 14),
        endDate: new Date(2019, 9, 15),
        allDay: true
      }]
    }); // eslint-disable-next-line no-undef

    resourceStore = new ResourceStore({
      data: t.getHackathonData().resources.rows
    });
    calendar = await getCalendar({
      date: new Date(2019, 9, 14),
      sidebar: false,
      eventStore,
      resourceStore,
      features: {
        eventTooltip: {
          showOn: 'hover',
          hoverDelay: 1000
        }
      },
      mode: 'week'
    });
    const {
      eventTooltip
    } = calendar.features;
    await t.moveMouseTo('.b-cal-event:Contains(Event 1)'); // It's registered the mouseover and triggered the delayed show

    await t.waitFor(() => eventTooltip._tooltip.hasTimeout('show')); // While it's in its delay phase, click to expand the all day row    

    await t.click(calendar.activeView.cornerElement); // Wait for the expand to complete

    await t.waitForAnimations(); // Show has been silently aborted with no errors

    t.notOk(eventTooltip._tooltip.hasTimeout('show'));
  });
  t.it('should cleanup floating widgets on destroy', async t => {
    eventStore = new EventStore({
      // Add a recurring meeting
      data: [{
        duration: 1,
        durationUnit: 'hour',
        id: 'twice-weekly',
        name: 'Recurring Meeting',
        recurrenceRule: 'FREQ=WEEKLY;BYDAY=TU,TH',
        startDate: new Date(2019, 9, 15, 13)
      }]
    }); // eslint-disable-next-line no-undef

    resourceStore = new ResourceStore({
      data: t.getHackathonData().resources.rows
    });
    calendar = await getCalendar({
      date: new Date(2019, 9, 14),
      sidebar: false,
      eventStore,
      resourceStore,
      features: {
        eventTooltip: {
          showOn: 'hover'
        }
      },
      mode: 'month'
    });
    const rm = eventStore.first,
          {
      eventTooltip
    } = calendar.features;
    t.chain({
      moveMouseTo: '[data-date="2019-10-17"] .b-cal-event:Contains(Recurring Meeting)'
    }, {
      waitForSelector: '.b-sch-event-tooltip:contains(Recurring Meeting)'
    }, next => {
      const startTime = DateHelper.format(rm.startDate, eventTooltip.tooltip.timeFormat),
            endTime = DateHelper.format(rm.endDate, eventTooltip.tooltip.timeFormat);
      t.is(calendar.features.eventTooltip.tooltip.title, 'Recurring Meeting', 'title set correctly');
      t.selectorExists(`.b-sch-tooltip-startdate:contains(${startTime})`, 'Start date rendered correctly');
      t.selectorExists(`.b-sch-tooltip-enddate:contains(${endTime})`, 'End date rendered correctly');
      t.selectorExists('.b-cal-tooltip-recurrence:contains(Weekly on  Tuesday and  Thursday)', 'Recurrence legend correct');
      next();
    }, () => {
      calendar.destroy();
      calendar = null; // Check that none of the floating things are persisting

      t.selectorNotExists('.b-overflowpopup');
      t.selectorNotExists('.b-sch-event-tooltip');
      t.selectorNotExists('.b-eventeditor');
    });
  });
  t.it('From an all day row with hover gesture', async t => {
    eventStore = new EventStore({
      data: [{
        duration: 1,
        durationUnit: 'day',
        id: 1,
        name: 'Event 1',
        allDay: true,
        startDate: new Date(2019, 9, 15),
        resourceId: 1
      }, {
        duration: 1,
        durationUnit: 'day',
        id: 2,
        name: 'Event 2',
        allDay: true,
        startDate: new Date(2019, 9, 15),
        resourceId: 1
      }, {
        duration: 1,
        durationUnit: 'day',
        id: 3,
        name: 'Event 3',
        allDay: true,
        startDate: new Date(2019, 9, 15),
        resourceId: 1
      }, {
        duration: 1,
        durationUnit: 'day',
        id: 4,
        name: 'Event 4',
        allDay: true,
        startDate: new Date(2019, 9, 15),
        resourceId: 1
      }]
    }); // eslint-disable-next-line no-undef

    resourceStore = new ResourceStore({
      data: [{
        id: 1,
        name: 'Resource 1'
      }]
    });
    calendar = await getCalendar({
      date: new Date(2019, 9, 14),
      sidebar: false,
      eventStore,
      resourceStore,
      features: {
        eventTooltip: {
          showOn: 'hover'
        }
      },
      mode: 'week'
    });
    await t.click('.b-cal-cell-overflow');
    await t.moveMouseTo('.b-overflowpopup[data-date="2019-10-15"] .b-cal-event-wrap', () => {});
    await t.waitForSelector('.b-sch-event-tooltip:contains(Event 1)');
  });
  t.it('From an all day row with click gesture', async t => {
    eventStore = new EventStore({
      data: [{
        duration: 1,
        durationUnit: 'day',
        id: 1,
        name: 'Event 1',
        allDay: true,
        startDate: new Date(2019, 9, 15),
        resourceId: 1
      }, {
        duration: 1,
        durationUnit: 'day',
        id: 2,
        name: 'Event 2',
        allDay: true,
        startDate: new Date(2019, 9, 15),
        resourceId: 1
      }, {
        duration: 1,
        durationUnit: 'day',
        id: 3,
        name: 'Event 3',
        allDay: true,
        startDate: new Date(2019, 9, 15),
        resourceId: 1
      }, {
        duration: 1,
        durationUnit: 'day',
        id: 4,
        name: 'Event 4',
        allDay: true,
        startDate: new Date(2019, 9, 15),
        resourceId: 1
      }]
    }); // eslint-disable-next-line no-undef

    resourceStore = new ResourceStore({
      data: [{
        id: 1,
        name: 'Resource 1'
      }]
    });
    calendar = await getCalendar({
      date: new Date(2019, 9, 14),
      sidebar: false,
      eventStore,
      resourceStore,
      features: {
        eventTooltip: {
          showOn: 'click'
        }
      },
      mode: 'week'
    });
    t.chain({
      click: '.b-cal-cell-overflow'
    }, {
      click: '.b-overflowpopup[data-date="2019-10-15"] .b-cal-event-wrap'
    }, {
      waitForSelector: '.b-sch-event-tooltip:contains(Event 1)'
    });
  });
  t.it('No title required', async t => {
    eventStore = new EventStore({
      // Add a recurring meeting
      data: [{
        duration: 1,
        durationUnit: 'hour',
        id: 'twice-weekly',
        name: 'Recurring Meeting',
        recurrenceRule: 'FREQ=WEEKLY;BYDAY=TU,TH',
        startDate: new Date(2019, 9, 15, 13)
      }]
    }); // eslint-disable-next-line no-undef

    resourceStore = new ResourceStore({
      data: t.getHackathonData().resources.rows
    });
    calendar = await getCalendar({
      date: new Date(2019, 9, 14),
      sidebar: false,
      eventStore,
      resourceStore,
      features: {
        eventTooltip: {
          showOn: 'hover',
          titleRenderer: null
        }
      },
      mode: 'month'
    });
    const rm = eventStore.first,
          {
      eventTooltip
    } = calendar.features;
    t.chain( // Need to move to another event, otherwise no mouseover gets fired.
    {
      moveMouseTo: '[data-date="2019-10-24"] .b-cal-event:Contains(Recurring Meeting)'
    }, {
      waitForSelector: '.b-sch-event-tooltip'
    }, () => {
      const startTime = DateHelper.format(rm.startDate, eventTooltip.tooltip.timeFormat),
            endTime = DateHelper.format(rm.endDate, eventTooltip.tooltip.timeFormat);
      t.waitFor(() => calendar.features.eventTooltip.tooltip.height > 160);
      t.notOk(calendar.features.eventTooltip.tooltip.title, 'title set correctly');
      t.selectorExists(`.b-sch-tooltip-startdate:contains(${startTime})`, 'Start date rendered correctly');
      t.selectorExists(`.b-sch-tooltip-enddate:contains(${endTime})`, 'End date rendered correctly');
      t.selectorExists('.b-cal-tooltip-recurrence:contains(Weekly on  Tuesday and  Thursday)', 'Recurrence legend correct');
    });
  });
  t.it('Should hide when overflow popup hides due to client resizing', async t => {
    eventStore = new EventStore({
      // Add a recurring meeting
      data: [{
        duration: 1,
        durationUnit: 'day',
        id: 1,
        name: 'Event 1',
        allDay: true,
        startDate: new Date(2019, 9, 15),
        resourceId: 1
      }, {
        duration: 1,
        durationUnit: 'day',
        id: 2,
        name: 'Event 2',
        allDay: true,
        startDate: new Date(2019, 9, 15),
        resourceId: 1
      }, {
        duration: 1,
        durationUnit: 'day',
        id: 3,
        name: 'Event 3',
        allDay: true,
        startDate: new Date(2019, 9, 15),
        resourceId: 1
      }, {
        duration: 1,
        durationUnit: 'day',
        id: 4,
        name: 'Event 4',
        allDay: true,
        startDate: new Date(2019, 9, 15),
        resourceId: 1
      }]
    }); // eslint-disable-next-line no-undef

    resourceStore = new ResourceStore({
      data: [{
        id: 1,
        name: 'Resource 1'
      }]
    });
    calendar = await getCalendar({
      height: 600,
      date: new Date(2019, 9, 14),
      sidebar: false,
      eventStore,
      resourceStore,
      features: {
        eventTooltip: {
          showOn: 'click'
        }
      },
      modes: {
        day: null,
        week: null,
        year: null,
        agenda: null
      }
    });
    t.chain( // focusOnToFront pushes focus inwards
    {
      waitFor: () => calendar.modes.month.overflowPopup.containsFocus,
      trigger: {
        click: '.b-cal-cell-overflow'
      }
    }, {
      click: '.b-overflowpopup[data-date="2019-10-15"] .b-cal-event:Contains(Event 1)'
    }, {
      waitForSelector: '.b-sch-event-tooltip:contains(Event 1)'
    }, {
      waitFor: calendar.features.eventTooltip.tooltip.ignoreScrollDuration
    }, // Now the overflow state will change so both floaters must go
    {
      waitForEvent: [calendar.modes.month, 'resize'],
      trigger: () => calendar.height = 700
    }, // Wait for tooltip to hide
    {
      waitFor: () => !calendar.features.eventTooltip.tooltip.isVisible
    }, // Only tooltip must be gone.
    () => {
      t.selectorExists('.b-overflowpopup:visible', 'Overflow popup correctly stays visible');
      t.selectorNotExists('.b-sch-event-tooltip', 'Tooltip correctly hidden');
    });
  });
  t.it('Should reveal events on click in weekview, if they are part of a cluster', async t => {
    eventStore = new EventStore({
      data: [{
        duration: 2,
        durationUnit: 'h',
        id: 1,
        name: 'Event 1',
        startDate: new Date(2019, 9, 15, 8),
        resourceId: 1
      }, {
        duration: 1,
        durationUnit: 'h',
        id: 2,
        name: 'Event 2',
        startDate: new Date(2019, 9, 15, 9),
        resourceId: 1
      }, {
        duration: 1,
        durationUnit: 'h',
        id: 3,
        name: 'Event 3',
        startDate: new Date(2019, 9, 15, 13),
        resourceId: 1
      }]
    }); // eslint-disable-next-line no-undef

    resourceStore = new ResourceStore({
      data: [{
        id: 1,
        name: 'Resource 1'
      }]
    });
    calendar = await getCalendar({
      height: 600,
      date: new Date(2019, 9, 14),
      sidebar: false,
      eventStore,
      resourceStore,
      mode: 'week'
    });
    t.chain({
      click: '.b-cal-event-wrap:contains(Event 1)',
      offset: [10, 40]
    }, async () => t.selectorExists('.b-cal-event-wrap.b-cal-event-reveal:contains(Event 1)', 'Reveal CSS class added for clustered tasks'), {
      waitFor: () => t.rect('.b-dayview-day-container .b-calendar-cell').width - t.rect('.b-cal-event-wrap.b-cal-event-reveal').width < 3,
      desc: 'Width 100% of day cell'
    }, {
      click: '.b-cal-event-wrap:contains(Event 1)',
      offset: [-10, 40]
    }, {
      click: '.b-cal-event-wrap:contains(Event 2)',
      offset: [10, 10]
    }, async () => {
      t.selectorCountIs('.b-cal-event-wrap.b-cal-event-reveal', 1);
      t.selectorExists('.b-cal-event-wrap.b-cal-event-reveal:contains(Event 2)', 'Reveal CSS class added for clustered tasks');
    }, {
      click: '.b-cal-event-wrap:contains(Event 3)'
    }, async () => t.selectorNotExists('.b-cal-event-wrap.b-cal-event-reveal:contains(Event 3)', 'Reveal CSS NOT class added for non-clustered tasks'));
  });
  t.it('Should not expand events on click in dayview, even if they are part of a cluster', async t => {
    eventStore = new EventStore({
      data: [{
        duration: 2,
        durationUnit: 'h',
        id: 1,
        name: 'Event 1',
        startDate: new Date(2019, 9, 14, 8),
        resourceId: 1
      }, {
        duration: 1,
        durationUnit: 'h',
        id: 2,
        name: 'Event 2',
        startDate: new Date(2019, 9, 14, 9),
        resourceId: 1
      }]
    }); // eslint-disable-next-line no-undef

    resourceStore = new ResourceStore({
      data: [{
        id: 1,
        name: 'Resource 1'
      }]
    });
    calendar = await getCalendar({
      eventStore,
      resourceStore,
      height: 600,
      date: new Date(2019, 9, 14),
      sidebar: false,
      mode: 'day'
    });
    let eventWidth;
    t.chain({
      waitForSelector: '.b-cal-event-wrap:contains(Event 1)'
    }, async () => {
      const el = t.query('.b-cal-event-wrap:contains(Event 1)')[0];
      eventWidth = el.offsetWidth;
    }, {
      click: '.b-cal-event-wrap:contains(Event 1)',
      offset: [10, 40]
    }, async () => {
      const el = t.query('.b-cal-event-wrap.b-cal-event-reveal')[0];
      t.ok(el, 'Reveal class added');
      t.is(el.offsetWidth, eventWidth, 'Width unchanged');
    });
  });
  t.it('With a custom idField', async t => {
    class MyEvent extends EventModel {
      static get fields() {
        return [];
      }

    }

    MyEvent.idField = 'Id';
    eventStore = new EventStore({
      modelClass: MyEvent,
      data: []
    }); // eslint-disable-next-line no-undef

    resourceStore = new ResourceStore({
      data: []
    });
    calendar = await getCalendar({
      date: new Date(2019, 9, 14),
      sidebar: false,
      eventStore,
      resourceStore,
      features: {
        eventTooltip: {
          showOn: 'hover'
        }
      },
      modes: {
        day: null,
        week: null,
        year: null,
        agenda: null
      }
    });
    const rm = new MyEvent({
      duration: 1,
      durationUnit: 'hour',
      id: 'twice-weekly',
      name: 'Recurring Meeting',
      recurrenceRule: 'FREQ=WEEKLY;BYDAY=TU,TH',
      startDate: new Date(2019, 9, 15, 13)
    }),
          {
      eventTooltip
    } = calendar.features;
    t.chain({
      waitForEvent: [calendar.modes.month, 'refresh'],
      trigger: () => eventStore.add(rm)
    }, {
      waitForAnimationFrame: null
    }, {
      moveMouseTo: '[data-date="2019-10-17"] .b-cal-event:Contains(Recurring Meeting)'
    }, {
      waitForSelector: '.b-sch-event-tooltip:contains(Recurring Meeting)',
      desc: 'Tooltip is shown'
    }, async () => {
      const startTime = DateHelper.format(rm.startDate, eventTooltip.tooltip.timeFormat),
            endTime = DateHelper.format(rm.endDate, eventTooltip.tooltip.timeFormat);
      t.is(calendar.features.eventTooltip.tooltip.title, 'Recurring Meeting', 'title set correctly');
      t.selectorExists(`.b-sch-tooltip-startdate:contains(${startTime})`, 'Start date rendered correctly');
      t.selectorExists(`.b-sch-tooltip-enddate:contains(${endTime})`, 'End date rendered correctly');
      t.selectorExists('.b-cal-tooltip-recurrence:contains(Weekly on  Tuesday and  Thursday)', 'Recurrence legend correct');
    }, {
      moveMouseTo: document.body,
      offset: [0, 0]
    }, // reset cursor position
    {
      waitForSelectorNotFound: '.b-sch-event-tooltip',
      desc: 'No tooltips shown'
    });
  }); // https://github.com/bryntum/support/issues/1452

  t.it('Should show "1 day" on tooltip when option selected on form', async t => {
    eventStore = new EventStore({
      data: [{
        id: 1,
        startDate: '2020-10-15T09:00:00',
        endDate: '2020-10-15T10:00:00',
        name: 'Event 1',
        resourceId: 1
      }, {
        id: 2,
        startDate: '2020-10-16T09:00:00',
        endDate: '2020-10-16T10:00:00',
        name: 'Event 2',
        resourceId: 1
      }]
    }); // eslint-disable-next-line no-undef

    resourceStore = new ResourceStore({
      data: [{
        id: 1,
        name: 'Resource 1'
      }]
    });
    calendar = await getCalendar({
      mode: 'month',
      date: new Date(2020, 9, 12),
      sidebar: false,
      eventStore,
      resourceStore,
      features: {
        eventTooltip: {
          showOn: 'click'
        }
      }
    });
    t.chain({
      dblclick: '.b-cal-event-wrap:contains(Event 1)'
    }, {
      click: '[data-ref="allDay"] input'
    }, {
      click: 'button:contains(Save)'
    }, {
      click: '.b-calendar-cell[data-date="2020-10-15"] .b-cal-event-wrap'
    }, {
      waitForSelector: '.b-sch-event-tooltip:contains(1 day)',
      desc: 'Event 1 tooltip updated to "1 day" after changed to "All day"'
    }, {
      dblclick: '.b-cal-event-wrap:contains(Event 2)'
    }, {
      click: '[data-ref="allDay"] input'
    }, {
      click: 'button:contains(Save)'
    }, {
      click: '.b-calendar-cell[data-date="2020-10-16"] .b-cal-event-wrap'
    }, {
      waitForSelector: '.b-sch-event-tooltip:contains(1 day)',
      desc: 'Event 2 tooltip updated to "1 day" after changed to "All day"'
    });
  }); // https://github.com/bryntum/support/issues/2851

  t.it('TOUCH: Should show week view event tooltip when tapping', async t => {
    eventStore = new EventStore({
      data: [{
        id: 1,
        duration: 1,
        durationUnit: 'h',
        name: 'One',
        startDate: new Date(2019, 9, 15, 10),
        resourceId: 1
      }, {
        id: 2,
        duration: 1,
        durationUnit: 'h',
        name: 'Two',
        startDate: new Date(2019, 9, 15, 12),
        resourceId: 1
      }]
    });
    resourceStore = new ResourceStore({
      data: [{
        id: 1,
        name: 'Resource 1'
      }]
    });
    calendar = await getCalendar({
      date: new Date(2019, 9, 14),
      sidebar: false,
      eventStore,
      resourceStore,
      mode: 'week'
    });
    await t.tap('.b-cal-event-wrap:contains(One)', null, null, {
      focus: false
    });
    await t.waitForSelector('.b-sch-event-tooltip:contains(One)');
    await t.tap('.b-cal-event-wrap:contains(Two)', null, null, {
      focus: false
    });
    await t.waitForSelector('.b-sch-event-tooltip:contains(Two)');
  }); // https://github.com/bryntum/support/issues/2851

  t.it('TOUCH: Should show agenda view event tooltip when tapping', async t => {
    eventStore = new EventStore({
      data: [{
        id: 1,
        duration: 1,
        durationUnit: 'h',
        name: 'One',
        startDate: new Date(2019, 9, 15, 10),
        resourceId: 1
      }, {
        id: 2,
        duration: 1,
        durationUnit: 'h',
        name: 'Two',
        startDate: new Date(2019, 9, 15, 12),
        resourceId: 1
      }]
    });
    resourceStore = new ResourceStore({
      data: [{
        id: 1,
        name: 'Resource 1'
      }]
    });
    calendar = await getCalendar({
      date: new Date(2019, 9, 14),
      sidebar: false,
      eventStore,
      resourceStore,
      mode: 'agenda',
      listeners: {
        eventlongpress: console.log
      }
    });
    const spy = t.spyOn(calendar.activeView, 'onElementLongPress');
    await t.tap('.b-cal-event-wrap:contains(One)', null, null, {
      focus: false
    });
    await t.waitForSelector('.b-sch-event-tooltip:contains(One)');
    await t.tap('.b-cal-agenda-event-time', null, null, {
      focus: false
    });
    await t.tap('.b-cal-event-wrap:contains(Two)', null, null, {
      focus: false
    });
    await t.waitForSelector('.b-sch-event-tooltip:contains(Two)'); // wait for long press timeout to expires

    await t.waitFor(500);
    t.expect(spy).not.toHaveBeenCalled();
  });
  t.it('Should not offer delete when Calendar is readOnly', async t => {
    eventStore = new EventStore({
      data: [{
        name: 'New event',
        allDay: 1,
        startDate: '2019-10-07T05:00:00.000',
        endDate: '2019-10-10T05:00:00.000',
        durationUnit: 'd',
        duration: 3,
        recurrenceRule: 'FREQ=WEEKLY;COUNT=3'
      }]
    }); // eslint-disable-next-line no-undef

    resourceStore = new ResourceStore({
      data: []
    });
    calendar = await getCalendar({
      readOnly: true,
      date: new Date(2019, 9, 14),
      eventStore,
      resourceStore,
      sidebar: false,
      features: {
        eventTooltip: {
          showOn: 'click'
        }
      },
      modes: {
        agenda: null,
        year: null,
        week: null,
        day: null,
        month: true
      }
    });
    t.selectorCountIs('.b-calendar-cell .b-cal-event', 12, 'It\'s a 4 day event occurring 3 times');
    t.selectorCountIs('.b-calendar-cell[data-date="2019-10-07"] .b-cal-event', 1);
    t.selectorCountIs('.b-calendar-cell[data-date="2019-10-08"] .b-overflow .b-cal-event', 1);
    t.selectorCountIs('.b-calendar-cell[data-date="2019-10-09"] .b-overflow .b-cal-event', 1);
    t.selectorCountIs('.b-calendar-cell[data-date="2019-10-10"] .b-overflow .b-cal-event', 1);
    t.selectorCountIs('.b-calendar-cell[data-date="2019-10-14"] .b-cal-event', 1);
    t.selectorCountIs('.b-calendar-cell[data-date="2019-10-15"] .b-overflow .b-cal-event', 1);
    t.selectorCountIs('.b-calendar-cell[data-date="2019-10-16"] .b-overflow .b-cal-event', 1);
    t.selectorCountIs('.b-calendar-cell[data-date="2019-10-17"] .b-overflow .b-cal-event', 1);
    t.selectorCountIs('.b-calendar-cell[data-date="2019-10-21"] .b-cal-event', 1);
    t.selectorCountIs('.b-calendar-cell[data-date="2019-10-22"] .b-overflow .b-cal-event', 1);
    t.selectorCountIs('.b-calendar-cell[data-date="2019-10-23"] .b-overflow .b-cal-event', 1);
    t.selectorCountIs('.b-calendar-cell[data-date="2019-10-24"] .b-overflow .b-cal-event', 1);
    t.chain({
      click: '.b-calendar-cell[data-date="2019-10-14"] .b-cal-event'
    }, {
      click: '.b-tool[data-ref="delete"]'
    }, {
      waitFor: 300,
      desc: 'The test is that nothing happens. There\'s nothing to wait for'
    }, // UI should be the same
    () => {
      t.selectorCountIs('.b-calendar-cell .b-cal-event', 12, 'It\'s a 4 day event occurring 3 times');
      t.selectorCountIs('.b-calendar-cell[data-date="2019-10-07"] .b-cal-event', 1);
      t.selectorCountIs('.b-calendar-cell[data-date="2019-10-08"] .b-overflow .b-cal-event', 1);
      t.selectorCountIs('.b-calendar-cell[data-date="2019-10-09"] .b-overflow .b-cal-event', 1);
      t.selectorCountIs('.b-calendar-cell[data-date="2019-10-10"] .b-overflow .b-cal-event', 1);
      t.selectorCountIs('.b-calendar-cell[data-date="2019-10-14"] .b-cal-event', 1);
      t.selectorCountIs('.b-calendar-cell[data-date="2019-10-15"] .b-overflow .b-cal-event', 1);
      t.selectorCountIs('.b-calendar-cell[data-date="2019-10-16"] .b-overflow .b-cal-event', 1);
      t.selectorCountIs('.b-calendar-cell[data-date="2019-10-17"] .b-overflow .b-cal-event', 1);
      t.selectorCountIs('.b-calendar-cell[data-date="2019-10-21"] .b-cal-event', 1);
      t.selectorCountIs('.b-calendar-cell[data-date="2019-10-22"] .b-overflow .b-cal-event', 1);
      t.selectorCountIs('.b-calendar-cell[data-date="2019-10-23"] .b-overflow .b-cal-event', 1);
      t.selectorCountIs('.b-calendar-cell[data-date="2019-10-24"] .b-overflow .b-cal-event', 1);
    });
  });
  t.it('No EventTooltip while editing', async t => {
    eventStore = new EventStore({
      data: [{
        duration: 1,
        durationUnit: 'hour',
        id: '1',
        name: 'Event 1',
        resourceId: 'r1',
        startDate: new Date(2019, 9, 15, 9)
      }]
    });
    resourceStore = new ResourceStore({
      data: [{
        id: 'r1',
        name: 'Resource 1'
      }]
    });
    calendar = await getCalendar({
      date: new Date(2019, 9, 14),
      eventStore,
      resourceStore,
      mode: 'month',
      features: {
        eventEdit: true,
        eventTooltip: {
          showOn: 'hover'
        }
      }
    });
    t.chain({
      dblclick: '.b-cal-event-wrap'
    }, {
      click: '.b-eventeditor input[type="text"]'
    }, {
      waitForSelectorNotFound: '.b-eventtip'
    }, {
      moveMouseTo: '.b-cal-event-wrap'
    }, {
      waitFor: 500,
      desc: 'Absolutely nothing should happen, we cannot wait for a condition.'
    }, // After that wait, there must still be no event tooltip
    () => {
      t.selectorNotExists('.b-eventtip');
    });
  }); // https://github.com/bryntum/support/issues/3139

  t.it('Should support using "on"/"un" function for registering/unregistering events', async t => {
    let called;
    eventStore = new EventStore({
      data: [{
        duration: 2,
        durationUnit: 'h',
        id: 1,
        name: 'Event 1',
        startDate: new Date(2019, 9, 15, 8),
        resourceId: 1
      }]
    }); // eslint-disable-next-line no-undef

    resourceStore = new ResourceStore({
      data: [{
        id: 1,
        name: 'Resource 1'
      }]
    });
    calendar = await getCalendar({
      height: 600,
      date: new Date(2019, 9, 14),
      sidebar: false,
      features: {
        eventEdit: true,
        eventTooltip: {
          showOn: 'hover'
        }
      },
      eventStore,
      resourceStore,
      mode: 'week'
    });

    const show = ({
      source
    }) => {
      called = true;
      t.is(source, calendar.features.eventTooltip.tooltip, 'show function called with tooltip parameter');
    }; // Add listener


    calendar.features.eventTooltip.on({
      show
    });
    await t.moveMouseTo('.b-cal-event');
    await t.waitForSelector('.b-tooltip');
    t.ok(called, 'listener fn was called'); // Remove listener

    calendar.features.eventTooltip.un({
      show
    });
    called = false;
    await t.moveMouseTo('[data-ref="todayButton"]');
    await t.moveMouseTo('.b-cal-event');
    await t.waitForSelector('.b-tooltip');
    t.notOk(called, 'listener fn was not called');
  });
  t.it('Should support being disabled', async t => {
    calendar = await t.getCalendar({
      height: 600,
      date: new Date(2019, 9, 14),
      sidebar: false,
      mode: 'week',
      features: {
        eventTooltip: {
          disabled: true
        }
      },
      events: [{
        startDate: new Date(2019, 9, 14),
        duration: 1,
        durationUnit: 'h',
        name: 'foo'
      }]
    });
    await t.click('.b-cal-event');
    t.selectorNotExists('.b-tooltip');
  });
  t.it('Should support the eventRecord property in both places, feature and tip', async t => {
    calendar = await t.getCalendar({
      height: 600,
      date: new Date(2019, 9, 14),
      sidebar: false,
      mode: 'week',
      features: {
        eventTooltip: {
          tools: {
            newTool: {
              cls: 'b-icon-add',
              tooltip: 'Test',
              handler: 'up.onTestToolClick'
            },
            testTool: {
              cls: 'b-fa b-fa-angle-left',

              handler() {
                testToolClicked = true; // this.up call must work if Panel owner is a Feature, not a widget

                t.is(this.up('calendar'), calendar);
              }

            }
          }
        }
      },
      events: [{
        startDate: new Date(2019, 9, 14),
        duration: 1,
        durationUnit: 'h',
        name: 'foo'
      }],

      onTestToolClick(e, panel, tool) {
        t.is(panel, calendar.features.eventTooltip.tooltip);
        t.is(tool, calendar.features.eventTooltip.tooltip.tools.newTool);
      }

    });
    let testToolClicked = false;
    const fooEvent = calendar.eventStore.first;
    t.isCalledOnce('onTestToolClick', calendar);
    await t.click('.b-cal-event');
    await t.waitForSelector('.b-tooltip');
    await t.click('[data-ref="newTool"]'); // The active event property in both places must be the same

    t.is(calendar.features.eventTooltip.eventRecord, fooEvent);
    t.is(calendar.features.eventTooltip.tooltip.eventRecord, fooEvent);
    await t.click('[data-ref="testTool"]');
    t.is(testToolClicked, true);
  }); // https://github.com/bryntum/support/issues/665

  t.it('Should hide certain tools for readOnly events', async t => {
    eventStore = new EventStore({
      // Add a recurring meeting
      data: [{
        duration: 1,
        durationUnit: 'hour',
        id: 1,
        name: 'Meeting',
        startDate: new Date(2019, 9, 15, 13),
        readOnly: true
      }]
    });
    resourceStore = new ResourceStore({
      data: t.getHackathonData().resources.rows
    });
    calendar = await getCalendar({
      date: new Date(2019, 9, 14),
      sidebar: false,
      eventStore,
      resourceStore,
      features: {
        eventTooltip: true
      },
      mode: 'month'
    });
    await t.click('[data-event-id="1"]');
    t.elementIsNotVisible('[data-ref=edit]', 'Edit tool hidden');
    t.elementIsNotVisible('[data-ref=delete]', 'Delete tool hidden');
  });
  t.it('header : false in feature config', async t => {
    calendar = await t.getCalendar({
      height: 600,
      date: new Date(2019, 9, 14),
      sidebar: false,
      mode: 'week',
      features: {
        eventTooltip: {
          header: false
        }
      },
      events: [{
        startDate: new Date(2019, 9, 14),
        duration: 1,
        durationUnit: 'h',
        name: 'foo'
      }]
    });
    await t.click('.b-cal-event');
    await t.waitForSelector('.b-eventtip');
    t.selectorNotExists('header.b-tooltip-header', 'Header correctly not rendered');
  });
  t.it('header : false in feature tooltip config', async t => {
    calendar = await t.getCalendar({
      height: 600,
      date: new Date(2019, 9, 14),
      sidebar: false,
      mode: 'week',
      features: {
        eventTooltip: {
          tooltip: {
            header: false
          }
        }
      },
      events: [{
        startDate: new Date(2019, 9, 14),
        duration: 1,
        durationUnit: 'h',
        name: 'foo'
      }]
    });
    await t.click('.b-cal-event');
    await t.waitForSelector('.b-eventtip');
    t.selectorNotExists('header.b-tooltip-header', 'Header correctly not rendered');
  });
  t.it('With beforeShow listener', async t => {
    let beforeShowFired = 0;
    calendar = await t.getCalendar({
      height: 600,
      date: new Date(2019, 9, 14),
      sidebar: false,
      mode: 'week',
      features: {
        eventTooltip: {
          tooltip: {
            listeners: {
              beforeShow() {
                beforeShowFired++;
                t.is(this, calendar.features.eventTooltip.tooltip, 'Scope set correctly');
              }

            }
          }
        }
      },
      events: [{
        startDate: new Date(2019, 9, 14),
        duration: 1,
        durationUnit: 'h',
        name: 'foo'
      }]
    });
    await t.click('.b-cal-event');
    await t.waitForSelector('.b-eventtip');
    t.is(beforeShowFired, 1, 'beforeShow listener called');
  });
});