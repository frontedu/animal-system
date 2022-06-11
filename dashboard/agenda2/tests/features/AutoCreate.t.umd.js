"use strict";

/* eslint-disable quote-props */
StartTest(t => {
  // eslint-disable-next-line no-unused-vars
  let calendar;
  t.beforeEach(function () {
    var _calendar;

    (_calendar = calendar) === null || _calendar === void 0 ? void 0 : _calendar.destroy();
  }); // https://github.com/bryntum/support/issues/2848

  t.it('Should not sync newly created event while event editor is open', async t => {
    let syncCount = 0;
    calendar = await t.getCalendar({
      date: new Date(2019, 9, 14),
      mode: 'week',
      crudManager: {
        resourceStore: new ResourceStore({
          data: t.getHackathonData().resources.rows
        }),
        transport: {
          load: {
            url: 'load'
          },
          sync: {
            url: 'sync'
          }
        },
        autoSync: true,
        listeners: {
          beforeSync() {
            syncCount++;
            return false;
          }

        }
      }
    });
    await t.doubleClick('.b-dayview-day-detail');
    t.is(syncCount, 0, 'No sync performed while event is in creating state');
    await t.type('[data-ref="nameField"] input', 'A');
    await t.click('[data-ref="resourceField"] .b-fieldtrigger');
    await t.click('.b-resourcecombo-picker .b-list-item:contains(Bryntum)');
    await t.click('button:contains(Save)');
    await t.waitFor(() => syncCount === 1);
    t.is(syncCount, 1, 'Sync performed after event editor closes creating state');
  }); // https://github.com/bryntum/support/issues/2894

  t.it('Should enable multiSelect for resource field in EventEditor after creating a new event', async t => {
    calendar = await t.getCalendar({
      date: new Date(2019, 9, 14),
      mode: 'week',
      crudManager: {
        resourceStore: new ResourceStore({
          data: t.getHackathonData().resources.rows
        }),
        eventStore: {
          data: [{
            startDate: new Date(2019, 9, 14, 9),
            name: 'foo',
            duration: 1,
            durationUnit: 'h'
          }]
        }
      }
    });
    const defaultCalendar = calendar.defaultCalendar;
    await t.doubleClick('.b-dayview-day-detail');
    t.ok(calendar.features.eventEdit.editor.widgetMap.resourceField.multiSelect, 'multiSelect enabled');
    t.is(calendar.eventStore.last.resource, defaultCalendar, 'defaultCalendar assigned');
  });
  t.it('Should show event popup when creating new event', async t => {
    calendar = await t.getCalendar({
      date: new Date(2019, 9, 14),
      mode: 'month',
      crudManager: {
        resourceStore: new ResourceStore({
          data: [{
            id: 'bryntum',
            name: 'Bryntum team',
            eventColor: '#249fbc'
          }]
        }),
        eventStore: new EventStore({
          data: [{
            name: '1',
            resourceId: 'bryntum',
            startDate: '2019-10-14T10:00:00',
            endDate: '2019-10-14T16:00:00'
          }, {
            name: '2',
            resourceId: 'bryntum',
            startDate: '2019-10-14T10:00:00',
            endDate: '2019-10-14T16:00:00'
          }, {
            name: '3',
            resourceId: 'bryntum',
            startDate: '2019-10-14T10:00:00',
            endDate: '2019-10-14T16:00:00'
          }, {
            name: '4',
            resourceId: 'bryntum',
            startDate: '2019-10-14T10:00:00',
            endDate: '2019-10-14T16:00:00'
          }, {
            name: '5',
            resourceId: 'bryntum',
            startDate: '2019-10-14T10:00:00',
            endDate: '2019-10-14T16:00:00'
          }]
        })
      }
    });

    for (let i = 6; i < 9; i++) {
      await t.doubleClick('.b-calendar-cell[data-date="2019-10-14"] .b-cal-cell-header');
      await t.type('input[name="name"]', i);
      await t.click('[data-ref="saveButton"]');
    }

    t.is(calendar.eventStore.count, 8, 'Correct amount of events');
  }); // https://github.com/bryntum/support/issues/2972

  t.it('Should not sync newly created event after pressing cancel', async t => {
    let syncCount = 0;
    calendar = await t.getCalendar({
      mode: 'week',
      crudManager: {
        resourceStore: new ResourceStore({
          data: t.getHackathonData().resources.rows
        }),
        transport: {
          sync: {
            url: 'sync'
          }
        },
        autoSync: true,
        listeners: {
          beforeSync() {
            syncCount++;
            return false;
          }

        }
      }
    });
    await t.doubleClick('.b-dayview-day-detail');
    t.is(syncCount, 0, 'No sync performed while event is in creating state');
    await t.type('[data-ref="nameField"] input', 'A');
    await t.click('[data-ref="resourceField"] .b-fieldtrigger');
    await t.click('.b-resourcecombo-picker .b-list-item:contains(Bryntum)');
    await t.click('button:contains(Cancel)');
    await t.waitFor(calendar.crudManager.autoSyncTimeout + 100);
    t.is(syncCount, 0, 'Sync performed after event editor closes creating state');
  }); // https://github.com/bryntum/support/issues/3004

  t.it('Should sync newly created event record + assignment record after pressing save in event editor', async t => {
    let syncCount = 0;
    calendar = await t.getCalendar({
      date: new Date(2019, 9, 14),
      mode: 'week',
      crudManager: {
        autoSync: true,
        transport: {
          sync: {
            url: 'foo'
          }
        },
        listeners: {
          beforeSync() {
            t.is(calendar.project.eventStore.changes.added.length, 1, '1 event added');
            t.is(calendar.project.assignmentStore.changes.added.length, 1, '1 assignment added');
            syncCount++;
            return false;
          }

        }
      },
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
    await t.doubleClick('.b-dayview-day-detail');
    t.is(syncCount, 0, 'No sync performed while event is in creating state');
    await t.type('[data-ref="nameField"] input', 'A');
    await t.click('button:contains(Save)');
    await t.waitFor(() => syncCount === 1); // wait a bit more to ensure no other sync attempts are made

    await t.waitFor(calendar.crudManager.autoSyncTimeout);
    t.is(syncCount, 1, 'Sync performed after event editor closes creating state');
  }); // https://github.com/bryntum/support/issues/3027

  t.it('Should create event in a filtered view', async t => {
    calendar = await t.getCalendar({
      date: new Date(2021, 5, 15)
    });
    const filterElement = calendar.widgetMap.eventFilter.element;
    await t.click(filterElement);
    await t.type(filterElement, 'foo');
    await t.doubleClick('.b-dayview-day-detail[data-date="2021-06-15"]');
    await t.waitForSelector('.b-eventeditor');
    await t.type('input[name="name"]', '1[ENTER]');
    t.selectorCountIs('.b-cal-event', 1, 'Event is rendered');
  }); // https://github.com/bryntum/support/issues/3185

  t.it('Should be possible to distinguish an event being created from other events', async t => {
    calendar = await t.getCalendar({
      date: new Date(2021, 5, 15)
    });
    await t.doubleClick('.b-dayview-day-detail[data-date="2021-06-15"]');
    t.is(calendar.eventStore.first.isCreating, true, 'isCreating returns true');
    t.selectorExists('.b-cal-event-wrap.b-iscreating', 'b-iscreating added');
    await t.waitForSelector('.b-eventeditor');
    await t.type('input[name="name"]', '1[ENTER]');
    t.selectorCountIs('.b-cal-event', 1, 'Event is rendered');
    t.selectorNotExists('.b-creating', 'b-iscreating not seen');
    t.is(calendar.eventStore.first.isCreating, false, 'isCreating returns false');
  });
});