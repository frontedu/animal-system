"use strict";

StartTest(t => {
  let calendar, eventStore, resourceStore;
  t.beforeEach(() => {
    var _calendar, _calendar$destroy;

    return (_calendar = calendar) === null || _calendar === void 0 ? void 0 : (_calendar$destroy = _calendar.destroy) === null || _calendar$destroy === void 0 ? void 0 : _calendar$destroy.call(_calendar);
  });

  async function setup(config = {}) {
    calendar = await t.getCalendar(Object.assign({
      date: new Date(2020, 9, 14),
      eventStore: {
        data: [{
          id: 1,
          startDate: new Date(2020, 9, 14, 8),
          endDate: new Date(2020, 9, 14, 14),
          name: 'regular 1',
          resourceId: 'resource1',
          cls: 'event-cls'
        }, {
          id: 2,
          startDate: new Date(2020, 9, 14),
          endDate: new Date(2020, 9, 15),
          name: 'allday 1',
          resourceId: 'resource1'
        }, {
          id: 3,
          startDate: new Date(2020, 9, 15, 8),
          endDate: new Date(2020, 9, 15, 14),
          name: 'regular 2',
          resourceId: 'resource2'
        }, {
          id: 4,
          startDate: new Date(2020, 9, 15),
          endDate: new Date(2020, 9, 16),
          name: 'allday 2',
          resourceId: 'resource2'
        }, {
          id: 5,
          startDate: new Date(2020, 9, 16, 8),
          endDate: new Date(2020, 9, 16, 14),
          name: 'regular 3',
          resourceId: 'resource3'
        }, {
          id: 6,
          startDate: new Date(2020, 9, 16),
          endDate: new Date(2020, 9, 17),
          name: 'allday 3',
          resourceId: 'resource3'
        }, {
          id: 7,
          startDate: new Date(2020, 9, 13, 8),
          endDate: new Date(2020, 9, 13, 14),
          name: 'regular 4'
        }, {
          id: 8,
          startDate: new Date(2020, 9, 13),
          endDate: new Date(2020, 9, 14),
          name: 'allday 4'
        }]
      },
      resourceStore: {
        data: [{
          id: 'resource1',
          name: 'Named',
          eventColor: 'orange'
        }, {
          id: 'resource2',
          name: 'Hex',
          eventColor: '#e90057'
        }, {
          id: 'resource3',
          name: 'None',
          cls: 'resource-cls'
        }]
      }
    }, config));
  }

  t.it('Should support `eventRenderer`', async t => {
    let checked;
    await setup({
      modes: {
        week: {
          showIcon: true,
          eventRenderer: ({
            eventRecord,
            resourceRecord,
            renderData
          }) => {
            if (!checked) {
              t.isInstanceOf(eventRecord, EventModel, 'EventModel');
              checked = true;
            }

            if (eventRecord.id === 7) {
              t.is(resourceRecord, null, 'No ResourceModel for this event');
            }

            renderData.style = 'font-weight:400';
            renderData.cls = 'theCls';
            renderData.iconCls.add('iconCls');
            return 'custom text';
          }
        }
      }
    });
    await t.waitForSelector('.b-cal-event:contains(custom text)');
    t.selectorCountIs('.iconCls', 8, 'all events received a `iconCls` through the eventRenderer');
    t.selectorCountIs('.theCls:contains(custom text)', 8, 'all events received a `cls` through the eventRenderer');
    t.selectorCountIs('.b-cal-event:contains(custom text)', 8, 'all events were passed through the eventRenderer');
    const barEl = t.query('.b-cal-event-wrap')[0];
    t.is(barEl.style.fontWeight, '400', 'Style set correctly');
  });
  t.it('Should apply eventColor', async t => {
    await setup();
    t.selectorCountIs('.b-cal-event-wrap.b-cal-color-orange', 2, '2 events with eventColor orange assigned as cls');
    t.selectorCountIs('.b-cal-event[style*=background-color]', 2, '2 events with eventColor as background-color');
    t.selectorNotExists('.b-cal-color-', 'No empty color class');
    calendar.resourceStore.first.eventColor = 'blue';
    await t.waitForAnimationFrame(); // updates on frame

    t.selectorCountIs('.b-cal-event-wrap.b-cal-color-blue', 2, '2 events with eventColor blue assigned as cls');
    calendar.eventStore.first.eventColor = 'red';
    await t.waitForAnimationFrame(); // updates on frame

    t.selectorCountIs('.b-cal-event-wrap.b-cal-color-blue', 1, '1 event with eventColor blue assigned as cls');
    t.selectorCountIs('.b-cal-event-wrap.b-cal-color-red', 1, '1 event with eventColor red assigned as cls');
  });
  t.it('Should apply cls from resource and event', async t => {
    await setup();
    t.selectorCountIs('.b-cal-event-wrap.resource-cls', 2, '2 events with resource cls applied');
    t.selectorCountIs('.b-cal-event-wrap.event-cls', 1, '1 event with event cls applied');
    calendar.resourceStore.last.cls = 'new-resource-cls';
    await t.waitForAnimationFrame(); // updates on frame

    t.selectorNotExists('.b-cal-event-wrap.resource-cls', 'No events with old resource cls');
    t.selectorCountIs('.b-cal-event-wrap.new-resource-cls', 2, '2 events with new resource cls applied');
    calendar.eventStore.first.cls = 'new-event-cls';
    await t.waitForAnimationFrame(); // updates on frame

    t.selectorNotExists('.b-cal-event-wrap.event-cls', 'No events with old event cls');
    t.selectorCountIs('.b-cal-event-wrap.new-event-cls', 1, '1 event with new event cls applied');
  });
  t.it('descriptionRenderer', async t => {
    eventStore = new EventStore({
      // Add a recurring meeting
      data: t.getHackathonData().events.rows.concat([{
        duration: 1,
        durationUnit: 'hour',
        id: 'twice-weekly',
        name: 'Recurring Meeting',
        recurrenceRule: 'FREQ=WEEKLY;BYDAY=TU,TH',
        startDate: new Date(2019, 9, 15, 13)
      }])
    });
    resourceStore = new ResourceStore({
      data: t.getHackathonData().resources.rows
    });
    calendar = await t.getCalendar({
      date: new Date(2019, 9, 14),
      eventStore,
      resourceStore,
      mode: 'day',
      modeDefaults: {
        descriptionRenderer() {
          return `This is a ${this.$$name}`;
        }

      }
    });
    const {
      viewDescription
    } = calendar.widgetMap;
    t.chain(next => {
      t.is(viewDescription.content, 'This is a DayView', 'renderer correct');
      next();
    }, {
      click: 'button:contains(Week)'
    }, next => {
      t.is(viewDescription.content, 'This is a WeekView', 'renderer correct');
      next();
    }, {
      click: 'button:contains(Month)'
    }, next => {
      t.is(viewDescription.content, 'This is a MonthView', 'renderer correct');
      next();
    }, {
      click: 'button:contains(Year)'
    }, next => {
      t.is(viewDescription.content, 'This is a YearView', 'renderer correct');
      next();
    }, {
      click: 'button:contains(Agenda)'
    }, () => {
      t.is(viewDescription.content, 'This is a AgendaView', 'renderer correct');
    });
  });
  t.it('descriptionRenderer as a string', async t => {
    eventStore = new EventStore({
      // Add a recurring meeting
      data: t.getHackathonData().events.rows.concat([{
        duration: 1,
        durationUnit: 'hour',
        id: 'twice-weekly',
        name: 'Recurring Meeting',
        recurrenceRule: 'FREQ=WEEKLY;BYDAY=TU,TH',
        startDate: new Date(2019, 9, 15, 13)
      }])
    });
    resourceStore = new ResourceStore({
      data: t.getHackathonData().resources.rows
    });
    calendar = await t.getCalendar({
      date: new Date(2019, 9, 14),
      eventStore,
      resourceStore,
      mode: 'day',
      modeDefaults: {
        descriptionRenderer: 'up.generateDescription'
      },

      generateDescription(view) {
        return `This is a ${view.$$name}`;
      }

    });
    const {
      viewDescription
    } = calendar.widgetMap;
    t.chain(next => {
      t.is(viewDescription.content, 'This is a DayView', 'renderer correct');
      next();
    }, {
      click: 'button:contains(Week)'
    }, next => {
      t.is(viewDescription.content, 'This is a WeekView', 'renderer correct');
      next();
    }, {
      click: 'button:contains(Month)'
    }, next => {
      t.is(viewDescription.content, 'This is a MonthView', 'renderer correct');
      next();
    }, {
      click: 'button:contains(Year)'
    }, next => {
      t.is(viewDescription.content, 'This is a YearView', 'renderer correct');
      next();
    }, {
      click: 'button:contains(Agenda)'
    }, () => {
      t.is(viewDescription.content, 'This is a AgendaView', 'renderer correct');
    });
  });
  t.it('Should apply style string to event bar', async t => {
    eventStore = new EventStore({
      // Add a recurring meeting
      data: t.getHackathonData().events.rows.concat([{
        duration: 1,
        durationUnit: 'hour',
        id: 'twice-weekly',
        name: 'Recurring Meeting',
        recurrenceRule: 'FREQ=WEEKLY;BYDAY=TU,TH',
        startDate: new Date(2019, 9, 15, 13),
        style: 'font-weight:bold;font-size:150%'
      }])
    });
    resourceStore = new ResourceStore({
      data: t.getHackathonData().resources.rows
    });
    calendar = await t.getCalendar({
      date: new Date(2019, 9, 14),
      eventStore,
      resourceStore,
      mode: 'month'
    });
    const recurringEls = t.query('.b-cal-event-wrap:contains(Recurring Meeting)');
    t.is(recurringEls.length, 6, 'Correct element count'); // Style string has worked

    recurringEls.forEach(el => t.ok(el.style.fontWeight === 'bold' && el.style.fontSize === '150%'));
  });
  t.it('Should apply style object to event bar', async t => {
    eventStore = new EventStore({
      // Add a recurring meeting
      data: t.getHackathonData().events.rows.concat([{
        duration: 1,
        durationUnit: 'hour',
        id: 'twice-weekly',
        name: 'Recurring Meeting',
        recurrenceRule: 'FREQ=WEEKLY;BYDAY=TU,TH',
        startDate: new Date(2019, 9, 15, 13),
        style: {
          fontWeight: 'bold',
          fontSize: '150%'
        }
      }])
    });
    resourceStore = new ResourceStore({
      data: t.getHackathonData().resources.rows
    });
    calendar = await t.getCalendar({
      date: new Date(2019, 9, 14),
      eventStore,
      resourceStore,
      mode: 'month'
    });
    const recurringEls = t.query('.b-cal-event-wrap:contains(Recurring Meeting)');
    t.is(recurringEls.length, 6, 'Correct element count'); // Style object has worked

    recurringEls.forEach(el => t.ok(el.style.fontWeight === 'bold' && el.style.fontSize === '150%'));
  });
  t.it('Should be able to hide time in day/week view', async t => {
    eventStore = new EventStore({
      // Add a recurring meeting
      data: t.getHackathonData().events.rows.concat([{
        duration: 1,
        durationUnit: 'hour',
        id: 'twice-weekly',
        name: 'Recurring Meeting',
        recurrenceRule: 'FREQ=WEEKLY;BYDAY=TU,TH',
        startDate: new Date(2019, 9, 15, 13),
        style: {
          fontWeight: 'bold',
          fontSize: '150%'
        }
      }])
    });
    resourceStore = new ResourceStore({
      data: t.getHackathonData().resources.rows
    });
    calendar = await t.getCalendar({
      date: new Date(2019, 9, 14),
      eventStore,
      resourceStore,
      mode: 'day',
      modes: {
        day: {
          showTime: false
        },
        week: {
          showTime: false
        }
      }
    });
    t.selectorNotExists('.b-event-time', 'No header time shown in day view');
    calendar.mode = 'week';
    t.selectorNotExists('.b-event-time', 'No header time shown in week view');
  }); // https://github.com/bryntum/support/issues/4212

  t.it('Should be able to combine with scheduler and create events with scheduler hidden', async t => {
    calendar = setup({
      date: new Date(2019, 9, 14),
      mode: 'week',
      modes: {
        timeline: {
          type: 'scheduler',
          displayName: 'Timeline'
        },
        week: true
      }
    });
    await t.dragBy({
      source: '[data-date="2019-10-13"].b-dayview-day-detail',
      delta: [0, 100]
    });
    await t.type(null, 'foo[ENTER]');
    t.pass('No crash');
  });
});