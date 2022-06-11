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
  t.it('sanity when loaded asynchronously', async t => {
    t.mockUrl('test-sanity-data', {
      delay: 100,
      responseText: JSON.stringify({
        success: true,
        resources: {
          rows: [{
            id: 'bryntum',
            name: 'Bryntum team',
            eventColor: '#249fbc'
          }]
        },
        events: {
          rows: t.getHackathonData().events.rows.concat([{
            duration: 1,
            durationUnit: 'hour',
            id: 'twice-weekly',
            name: 'Recurring Meeting',
            recurrenceRule: 'FREQ=WEEKLY;BYDAY=TU,TH',
            startDate: new Date(2019, 9, 15, 13)
          }])
        }
      })
    });
    calendar = await getCalendar({
      crudManager: {
        transport: {
          load: {
            url: 'test-sanity-data'
          }
        },
        autoLoad: true,
        autoSync: false
      },
      date: new Date(2019, 9, 14),
      mode: 'month',
      modeDefaults: {
        eventHeight: 18,

        eventRenderer({
          eventRecord,
          renderData
        }) {
          // highlight all events which are related to conferences
          if (eventRecord.name.includes('Breakfast')) {
            renderData.style.textDecoration = 'underline';
            renderData.cls.breakfast = true;
          }
        }

      }
    });
    t.chain({
      waitForSelector: '.b-cal-event-wrap'
    }, () => {
      // Only the recurring events within the range of real data are visible
      t.selectorCountIs('.b-cal-event-body:contains(Recurring Meeting)', 6);
      t.selectorCountIs('.b-cal-event-wrap.b-allday.b-continues-right:not(.b-overflow):not(.b-continues-left)', 1, 'Hackathon start el found');
      t.selectorCountIs('.b-cal-event-wrap.b-allday.b-continues-left:not(.b-overflow):not(.b-continues-right)', 1, 'Hackathon end el found');
      const allDayElement = t.query('.b-allday .b-cal-event')[0];
      t.is(DomHelper.getStyleValue(allDayElement, 'background-color'), 'rgb(36, 159, 188)');
      const conferenceEls = t.query('.b-cal-event-wrap:contains(Breakfast)');
      t.ok(conferenceEls.length, 'Breakfast shown'); // Check renderer has worked

      conferenceEls.forEach(el => {
        t.is(el.style.textDecoration, 'underline', 'Were able to set inline style in eventRenderer');
      });
    });
  }); // https://github.com/bryntum/support/issues/2399

  t.it('Sync not performed on initial data load', async t => {
    t.mockUrl('2399-load', {
      delay: 100,
      responseText: JSON.stringify({
        success: true,
        resources: {
          rows: [{
            id: 'bryntum',
            name: 'Bryntum team',
            eventColor: '#249fbc'
          }]
        },
        events: {
          rows: t.getHackathonData().events.rows.concat([{
            duration: 1,
            durationUnit: 'hour',
            id: 'twice-weekly',
            name: 'Recurring Meeting',
            recurrenceRule: 'FREQ=WEEKLY;BYDAY=TU,TH',
            startDate: new Date(2019, 9, 15, 13)
          }])
        }
      })
    });
    t.mockUrl('2399-sync', function () {
      t.fail('Sync erroneously performed');
    });
    calendar = await getCalendar({
      crudManager: {
        transport: {
          load: {
            url: '2399-load'
          },
          sync: {
            url: '2399-sync'
          }
        },
        autoLoad: true,
        autoSync: true
      },
      date: new Date(2019, 9, 14),
      mode: 'month',
      modeDefaults: {
        eventHeight: 18,

        eventRenderer({
          eventRecord,
          renderData
        }) {
          // highlight all events which are related to conferences
          if (eventRecord.name.includes('Breakfast')) {
            renderData.style.textDecoration = 'underline';
            renderData.cls.breakfast = true;
          }
        }

      }
    });
    await t.waitForSelector('.b-cal-event-wrap'); // Wait for the autoSync timer to have fired, so that we
    // really check that it is not going to happen.

    await t.waitFor(calendar.crudManager.autoSyncTimeout + 500);
  });
  t.it('Should display and clear mask when crudManager sync fails', async t => {
    t.mockUrl('invalid-sync-url', {
      status: 404,
      delay: 2000,
      // autoShow is 1sec by default
      ok: false
    });
    calendar = await getCalendar({
      date: new Date(2019, 9, 14),
      mode: 'month',
      crudManager: {
        transport: {
          load: {
            url: 'invalid-sync-url'
          },
          sync: {
            url: 'invalid-sync-url'
          }
        },
        autoLoad: true,
        autoSync: true
      }
    }); // load/syncMask should appear automatically

    await t.waitForSelector('.b-mask.b-visible:contains(Loading)');
    t.selectorExists('.b-mask .b-icon-spinner');
    t.selectorNotExists('.b-mask .b-icon-warning'); // then switch to failure

    await t.waitForSelector('.b-mask:contains(Data loading failed)');
    t.selectorNotExists('.b-mask .b-icon-spinner');
    t.selectorExists('.b-mask .b-icon-warning'); // then go away (all automatically and by default)

    await t.waitForSelectorNotFound('.b-mask.b-visible');
  });
  t.it('Mode reordering', async t => {
    eventStore = new EventStore({
      data: []
    });
    resourceStore = new ResourceStore({
      data: []
    });
    calendar = await getCalendar({
      date: new Date(2019, 9, 14),
      sidebar: false,
      eventStore,
      resourceStore,
      modes: {
        agenda: {
          weight: 0
        },
        year: {
          weight: 1
        },
        month: {
          weight: 2
        },
        week: {
          weight: 3
        },
        day: {
          weight: 4
        }
      },
      mode: 'agenda'
    });
    const {
      modeSelector
    } = calendar.tbar.widgetMap,
          {
      viewContainer
    } = calendar.widgetMap; // modeSelector button group is ordered as configured by the weights

    t.isDeeply(modeSelector.items.map(i => i.ref.split('ShowButton')[0]), ['agenda', 'year', 'month', 'week', 'day']); // Items have been correctly ordered

    t.isDeeply(viewContainer.items.map(i => i.ref), ['agenda', 'year', 'month', 'week', 'day']);
  });
  t.it('404 message', async t => {
    calendar = await getCalendar({
      width: 1000,
      height: 750,
      date: new Date(2011, 0, 1),
      eventStore: null,
      resourceStore: null,
      crudManager: {
        transport: {
          load: {
            url: 'this-will-be-404'
          }
        },
        autoLoad: true,
        autoSync: false
      }
    }); // English text found

    t.waitForSelector('.b-mask-text:contains(Data loading failed!)');
  });
});