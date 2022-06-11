"use strict";

StartTest(t => {
  let calendar, resourceView;
  t.beforeEach(t => {
    var _calendar, _calendar$destroy;

    return (_calendar = calendar) === null || _calendar === void 0 ? void 0 : (_calendar$destroy = _calendar.destroy) === null || _calendar$destroy === void 0 ? void 0 : _calendar$destroy.call(_calendar);
  });

  async function setup(config = {}) {
    calendar = await t.getCalendar(ObjectHelper.merge({
      date: new Date(2021, 8, 12),
      resourceImagePath: '../examples/_shared/images/users/',
      modes: {
        day: null,
        week: null,
        month: null,
        year: null,
        agenda: null,
        weekResources: {
          type: 'resource',
          title: 'Week resources'
        }
      },
      resources: [{
        id: 1,
        name: 'Bruce Wayne',
        image: 'arnold.jpg',
        eventColor: 'blue',
        alias: 'Batman'
      }, {
        id: 2,
        name: 'Clark Kent',
        image: 'rob.jpg',
        eventColor: 'orange',
        alias: 'Superman'
      }],
      events: [{
        id: 1,
        name: 'Redecorate the cave',
        resourceId: 1,
        startDate: '2021-09-13T10:00',
        endDate: '2021-09-13T11:00'
      }, {
        id: 2,
        name: 'Avoid kryptonite',
        resourceId: 2,
        startDate: '2021-09-13T10:00',
        endDate: '2021-09-13T11:00'
      }]
    }, config));
    resourceView = calendar.modes.weekResources;
    await t.waitForAnimations();
  }

  t.it('Syncing settings which must be shared between all child views', async t => {
    await setup({
      resources: null,
      resourceStore: {
        data: [{
          id: 1,
          name: 'Bruce Wayne',
          image: 'arnold.jpg',
          eventColor: 'blue',
          alias: 'Batman'
        }, {
          id: 2,
          name: 'Clark Kent',
          image: 'rob.jpg',
          eventColor: 'orange',
          alias: 'Superman'
        }]
      }
    });
    const axisCount = DomHelper.scrollBarWidth ? 2 : 1;
    await t.waitForSelector('.b-resourcedayviewtimeaxis'); // 14 visible dys

    t.selectorCountIs('.b-dayview-day-detail.b-calendar-cell:not([data-date="1970-01-01"])', 14); // The time axis and the scroller (if we show scrollbars) are shown

    t.selectorCountIs('.b-resourcedayviewtimeaxis', axisCount); // Filter out Bruce Wayne

    await t.click('[data-ref="resourceFilter"] [data-id="1"]');
    t.selectorCountIs('.b-dayview-day-detail.b-calendar-cell:not([data-date="1970-01-01"])', 7);
    t.isDeeply([...resourceView.viewCache].map(v => v.minWidth), [0, 0]);
    resourceView.hideNonWorkingDays = true;
    resourceView.resourceWidth = '40em';
    t.selectorCountIs('.b-dayview-day-detail.b-calendar-cell:not([data-date="1970-01-01"])', 5);
    resourceView.nonWorkingDays[3] = 1;
    t.selectorCountIs('.b-dayview-day-detail.b-calendar-cell:not([data-date="1970-01-01"])', 4); // Filter Bruce Wayne back in

    await t.click('[data-ref="resourceFilter"] [data-id="1"]'); // All changes made while he was hidden are applied.

    t.selectorCountIs('.b-dayview-day-detail.b-calendar-cell:not([data-date="1970-01-01"])', 8);
    t.isDeeply([...resourceView.viewCache].map(v => v.element.style.minWidth), ['40em', '40em']);
  });
  t.it('Multi assignment', async t => {
    t.mockUrl('/4173/multi', {
      responseText: JSON.stringify({
        success: true,
        resources: {
          rows: [{
            id: 1,
            name: 'Resource 1'
          }, {
            id: 2,
            name: 'Resource 2'
          }]
        },
        assignments: {
          rows: [{
            id: 1,
            eventId: 1,
            resourceId: 1
          }, {
            id: 2,
            eventId: 1,
            resourceId: 2
          }]
        },
        events: {
          rows: [{
            id: 1,
            name: 'Assigned to both',
            startDate: '2022-02-10T07:00',
            endDate: '2022-02-10T08:00'
          }]
        }
      })
    });
    await setup({
      crudManager: {
        autoLoad: true,
        transport: {
          load: {
            url: '/4173/multi'
          }
        }
      },
      date: '2022-02-10',
      resources: null,
      events: null
    }); // Event is rendered in both child views

    t.selectorCountIs('.b-cal-event:contains(Assigned to both)', 2); // Drag into Resource 1.
    // It's already assigned to Resource 1, so this is just deassigning from resource 2

    await t.dragBy({
      source: `#${resourceView.id}-resourceweekview-2 .b-cal-event-wrap[data-event-id="1"]`,
      delta: [-calendar.activeView.items[1].width, 0]
    }); // It must be deassigned from 2

    await t.waitFor(() => t.query('.b-cal-event:contains(Assigned to both)').length === 1); // And in Resource 1's view

    t.selectorExists(`#${resourceView.id}-resourceweekview-1 .b-cal-event-wrap[data-event-id="1"]`); // Drag into Resource 2.
    // This assigns to Resource 2 and deassigned from Resource 1

    await t.dragBy({
      source: `#${resourceView.id}-resourceweekview-1 .b-cal-event-wrap[data-event-id="1"]`,
      delta: [calendar.activeView.items[1].width, 0]
    }); // It's reassigned to 2

    await t.waitFor(() => t.query(`#${resourceView.id}-resourceweekview-2 .b-cal-event-wrap[data-event-id="1"]`).length === 1); // It's still single assigned

    t.selectorCountIs('.b-cal-event:contains(Assigned to both)', 1);
  });
  t.it('Resource order with stableResourceOrder : true (the default)', async t => {
    await setup({
      resources: null,
      resourceStore: {
        data: [{
          id: 1,
          name: 'Bruce Wayne',
          image: 'arnold.jpg',
          eventColor: 'blue',
          alias: 'Batman'
        }, {
          id: 2,
          name: 'Clark Kent',
          image: 'rob.jpg',
          eventColor: 'orange',
          alias: 'Superman'
        }],
        filters: [{
          property: 'name',
          operator: '=',
          value: 'Clark Kent'
        }]
      },
      sidebar: {
        items: {
          resourceFilter: {
            store: {
              sorters: []
            }
          }
        }
      }
    });

    const view = calendar.activeView,
          collectViewResourceNames = () => {
      const result = [];
      view.items.forEach(v => {
        if (!v.isResourceDayViewTimeAxis && v.isVisible) {
          result.push(v.resource.name);
        }
      });
      return result;
    },
          collectResourceFilterNames = () => {
      return [...calendar.sidebar.element.querySelectorAll('.b-resourcefilter .b-list-item')].map(i => i.innerText);
    }; // Only Clark Kent is represented in the resource filter


    t.isDeeply(collectResourceFilterNames(), ['Clark Kent'], 'Only one resource filterable'); // Only Clark Kent is represented in the resource view

    t.isDeeply(collectViewResourceNames(), ['Clark Kent'], 'Only one resource visible'); // Allow Bruce Wayne into the resource store

    calendar.resourceStore.clearFilters(); // Two filter items now

    t.isDeeply(collectResourceFilterNames(), ['Bruce Wayne', 'Clark Kent'], 'Two resources filterable'); // Still only Clark Kent is represented in the resource view

    t.isDeeply(collectViewResourceNames(), ['Clark Kent'], 'Only one resource visible'); // Check Bruce Wayne's item in the ResourceFilter

    await t.click('.b-resourcefilter .b-list-item[data-index="0"]'); // Wait for views to be correct

    await t.waitFor(() => ObjectHelper.isEqual(collectViewResourceNames(), ['Bruce Wayne', 'Clark Kent']));
    calendar.resourceStore.insert(0, {
      id: 0,
      name: 'First'
    }); // Three filter items now

    t.isDeeply(collectResourceFilterNames(), ['First', 'Bruce Wayne', 'Clark Kent'], 'Three resources filterable'); // Still only the two resource views

    t.isDeeply(collectViewResourceNames(), ['Bruce Wayne', 'Clark Kent']); // Check First's item in the ResourceFilter

    await t.click('.b-resourcefilter .b-list-item[data-index="0"]'); // Wait for views to be correct

    await t.waitFor(() => ObjectHelper.isEqual(collectViewResourceNames(), ['First', 'Bruce Wayne', 'Clark Kent'])); // Sort into ['Bruce Wayne', 'Clark Kent', 'First'] order

    calendar.resourceStore.sort((l, r) => l.name < r.name ? -1 : l.name > r.name ? 1 : 0); // Wait for views to be correct

    await t.waitFor(() => ObjectHelper.isEqual(collectViewResourceNames(), ['Bruce Wayne', 'Clark Kent', 'First'])); // Filters have changed order too

    t.isDeeply(collectResourceFilterNames(), ['Bruce Wayne', 'Clark Kent', 'First'], 'Three resources filterable');
  });
  t.it('Resource order with stableResourceOrder : false', async t => {
    await setup({
      resources: null,
      resourceStore: {
        data: [{
          id: 1,
          name: 'Bruce Wayne',
          image: 'arnold.jpg',
          eventColor: 'blue',
          alias: 'Batman'
        }, {
          id: 2,
          name: 'Clark Kent',
          image: 'rob.jpg',
          eventColor: 'orange',
          alias: 'Superman'
        }],
        filters: [{
          property: 'name',
          operator: '=',
          value: 'Clark Kent'
        }]
      },
      sidebar: {
        items: {
          resourceFilter: {
            store: {
              sorters: []
            }
          }
        }
      },
      modes: {
        weekResources: {
          stableResourceOrder: false
        }
      }
    });

    const view = calendar.activeView,
          collectViewResourceNames = () => {
      const result = [];
      view.items.forEach(v => {
        if (!v.isResourceDayViewTimeAxis && v.isVisible) {
          result.push(v.resource.name);
        }
      });
      return result;
    },
          collectResourceFilterNames = () => {
      return [...calendar.sidebar.element.querySelectorAll('.b-resourcefilter .b-list-item')].map(i => i.innerText);
    }; // Only Clark Kent is represented in the resource filter


    t.isDeeply(collectResourceFilterNames(), ['Clark Kent'], 'Only one resource filterable'); // Only Clark Kent is represented in the resource view

    t.isDeeply(collectViewResourceNames(), ['Clark Kent'], 'Only one resource visible'); // Allow Bruce Wayne into the resource store

    calendar.resourceStore.clearFilters(); // Two filter items now

    t.isDeeply(collectResourceFilterNames(), ['Bruce Wayne', 'Clark Kent'], 'Two resources filterable'); // Still only Clark Kent is represented in the resource view

    t.isDeeply(collectViewResourceNames(), ['Clark Kent'], 'Only one resource visible'); // Check Bruce Wayne's item in the ResourceFilter

    await t.click('.b-resourcefilter .b-list-item[data-index="0"]'); // Wait for views to be correct

    await t.waitFor(() => ObjectHelper.isEqual(collectViewResourceNames(), ['Clark Kent', 'Bruce Wayne']));
    calendar.resourceStore.insert(0, {
      id: 0,
      name: 'First'
    }); // Three filter items now

    t.isDeeply(collectResourceFilterNames(), ['First', 'Bruce Wayne', 'Clark Kent'], 'Three resources filterable'); // Still only the two resource views

    t.isDeeply(collectViewResourceNames(), ['Clark Kent', 'Bruce Wayne']); // Check First's item in the ResourceFilter

    await t.click('.b-resourcefilter .b-list-item[data-index="0"]'); // Wait for views to be correct

    await t.waitFor(() => ObjectHelper.isEqual(collectViewResourceNames(), ['Clark Kent', 'Bruce Wayne', 'First'])); // Sort into ['First', 'Clark Kent', 'Bruce Wayne'] order

    calendar.resourceStore.sort((l, r) => l.name < r.name ? 1 : l.name > r.name ? -1 : 0); // Wait for views to be correct

    await t.waitFor(() => ObjectHelper.isEqual(collectViewResourceNames(), ['First', 'Clark Kent', 'Bruce Wayne'])); // Filters have changed order too

    t.isDeeply(collectResourceFilterNames(), ['First', 'Clark Kent', 'Bruce Wayne'], 'Three resources filterable');
    const noAllDayEventsRowHeights = resourceView.items.map(v => v.allDayEvents.height);
    calendar.eventStore.add({
      resourceId: 0,
      name: 'New',
      allDay: true,
      startDate: '2021-09-13T10:00',
      endDate: '2021-09-13T11:00'
    });
    await t.waitForAnimations();
    let allDayHeights = resourceView.items.map(v => v.allDayEvents.height); // All day rows must always be same height and must be greater than when no all day events

    for (let i = 0, {
      length
    } = allDayHeights; i < length; i++) {
      i && t.is(allDayHeights[i - 1], allDayHeights[i]);
      t.isGreater(allDayHeights[i], noAllDayEventsRowHeights[i]);
    } // Check First's item in the ResourceFilter


    await t.click('.b-resourcefilter .b-list-item[data-index="0"]'); // Wait for views to be correct

    await t.waitFor(() => ObjectHelper.isEqual(collectViewResourceNames(), ['Clark Kent', 'Bruce Wayne']));
    await t.waitForAnimations();
    allDayHeights = resourceView.items.map(v => v.allDayEvents.height); // All day rows must always be same height and must be zero when no all day events

    for (let i = 0, {
      length
    } = allDayHeights; i < length; i++) {
      i && t.is(allDayHeights[i - 1], allDayHeights[i]);
      t.is(allDayHeights[i], noAllDayEventsRowHeights[i]);
    } // Check First's item in the ResourceFilter.
    // We need to check that all day height are synced when its the last item
    // which dictates the highest all day row.


    await t.click('.b-resourcefilter .b-list-item[data-index="0"]'); // Wait for views to be correct

    await t.waitFor(() => ObjectHelper.isEqual(collectViewResourceNames(), ['Clark Kent', 'Bruce Wayne', 'First']));
    await t.waitForAnimations();
    allDayHeights = resourceView.items.map(v => v.allDayEvents.height); // All day rows must always be same height and must be greater than when no all day events

    for (let i = 0, {
      length
    } = allDayHeights; i < length; i++) {
      i && t.is(allDayHeights[i - 1], allDayHeights[i]);
      t.isGreater(allDayHeights[i], noAllDayEventsRowHeights[i]);
    }

    await t.click('[data-ref="nextButton"]');
    await t.waitForAnimations();
    allDayHeights = resourceView.items.map(v => v.allDayEvents.height); // All day rows must always be same height and must be zero when no all day events

    for (let i = 0, {
      length
    } = allDayHeights; i < length; i++) {
      i && t.is(allDayHeights[i - 1], allDayHeights[i]);
      t.is(allDayHeights[i], noAllDayEventsRowHeights[i]);
    }

    await t.click('[data-ref="prevButton"]');
    await t.waitForAnimations();
    allDayHeights = resourceView.items.map(v => v.allDayEvents.height); // All day rows must always be same height and must zbe greater than when no all day events

    for (let i = 0, {
      length
    } = allDayHeights; i < length; i++) {
      i && t.is(allDayHeights[i - 1], allDayHeights[i]);
      t.isGreater(allDayHeights[i], noAllDayEventsRowHeights[i]);
    }
  });
  t.it('Resource order with stableResourceOrder : false and resourceStore sort', async t => {
    await setup({
      resources: null,
      resourceStore: {
        data: [{
          id: 1,
          name: 'Bruce Wayne',
          image: 'arnold.jpg',
          eventColor: 'blue',
          alias: 'Batman'
        }, {
          id: 2,
          name: 'Clark Kent',
          image: 'rob.jpg',
          eventColor: 'orange',
          alias: 'Superman'
        }]
      },
      sidebar: false,
      modes: {
        weekResources: {
          stableResourceOrder: false
        }
      }
    });
    const axisCount = DomHelper.scrollBarWidth ? 2 : 1;
    await t.waitForSelector('.b-resourcedayviewtimeaxis'); // The time axis and the scroller (if we show scrollbars) are shown

    t.selectorCountIs('.b-resourcedayviewtimeaxis', axisCount);
    calendar.resourceStore.sort(); // Response to sort must remove child views, but *not* the time axis and scroller widgets

    t.selectorCountIs('.b-resourcedayviewtimeaxis', axisCount);
  });
  t.it('Resource views should sync all day height on add/remove', async t => {
    await setup({
      resources: null,
      resourceStore: {
        data: [{
          id: 1,
          name: 'Bruce Wayne',
          image: 'arnold.jpg',
          eventColor: 'blue',
          alias: 'Batman'
        }, {
          id: 2,
          name: 'Clark Kent',
          image: 'rob.jpg',
          eventColor: 'orange',
          alias: 'Superman'
        }],
        filters: [{
          property: 'name',
          operator: '=',
          value: 'Bruce Wayne'
        }]
      },
      events: [{
        id: 1,
        name: 'Redecorate the cave',
        resourceId: 1,
        startDate: '2021-09-13T10:00',
        endDate: '2021-09-13T11:00'
      }, {
        id: 2,
        name: 'Save world',
        allDay: true,
        resourceId: 2,
        startDate: '2021-09-13T10:00',
        endDate: '2021-09-13T11:00'
      }],
      sidebar: false
    });
    const b = calendar.activeView.items[1];
    t.selectorCountIs('.b-weekview', 1);
    t.is(b.allDayEvents.cellContentHeight, 0);
    calendar.resourceStore.clearFilters();
    await t.waitFor(() => document.querySelectorAll('.b-weekview').length === 2);
    const c = calendar.activeView.items[2];
    await t.waitForAnimations(); // Should expand to match

    await t.waitFor(() => b.allDayEvents.cellContentHeight === c.allDayEvents.cellContentHeight);
    calendar.resourceStore.filter({
      property: 'name',
      operator: '=',
      value: 'Bruce Wayne'
    });
    await t.waitFor(() => document.querySelectorAll('.b-weekview').length === 1);
    await t.waitForAnimations(); // Should shrink back down

    await t.waitFor(() => b.allDayEvents.cellContentHeight === 0);
  });
  t.it('Should render avatars & name by default', async t => {
    await setup();
    t.selectorExists('img[src="../examples/_shared/images/users/arnold.jpg"]', 'Image found for Bruce');
    t.selectorExists('img[src="../examples/_shared/images/users/rob.jpg"]', 'Image found for Clark');
    t.selectorExists('.b-resource-name:textEquals(Bruce Wayne)', 'Bruce Waynes name found');
    t.selectorExists('.b-resource-name:textEquals(Clark Kent)', 'Clark Kents name found');
  });
  t.it('Should allow opting out of avatar', async t => {
    await setup({
      modes: {
        weekResources: {
          showAvatars: false
        }
      }
    });
    t.selectorNotExists('img', 'No image found');
    t.selectorExists('.b-resource-name:textEquals(Bruce Wayne)', 'Bruce Waynes name found');
    t.selectorExists('.b-resource-name:textEquals(Clark Kent)', 'Clark Kents name found');
  });
  t.it('Should allow displaying meta', async t => {
    await setup({
      modes: {
        weekResources: {
          meta: 'alias'
        }
      }
    });
    t.selectorExists('.b-resource-meta:textEquals(Batman)', 'Batman meta found');
    t.selectorExists('.b-resource-meta:textEquals(Superman)', 'Superman meta found');
  });
  t.it('Should allow displaying meta, function', async t => {
    await setup({
      modes: {
        weekResources: {
          meta: resource => resource.alias
        }
      }
    });
    t.selectorExists('.b-resource-meta:textEquals(Batman)', 'Batman meta found');
    t.selectorExists('.b-resource-meta:textEquals(Superman)', 'Superman meta found');
  });
  t.it('Should autoCreate event for correct resource', async t => {
    await setup({
      features: {
        eventEdit: false
      }
    });
    const initialCount = calendar.eventStore.count;
    await t.doubleClick('.b-first-resource-view .b-day-name-date');
    await t.waitForProjectReady(calendar);
    t.is(calendar.eventStore.count, initialCount + 1, 'Event added');
    t.is(calendar.eventStore.last.resource.id, 1, 'Event assigned to correct resource');
    await t.doubleClick('.b-last-resource-view .b-day-name-date');
    await t.waitForProjectReady(calendar);
    t.is(calendar.eventStore.count, initialCount + 2, 'Event added');
    t.is(calendar.eventStore.last.resource.id, 2, 'Event assigned to correct resource');
  });
  t.it('Should support hideNonWorkingDays / resourceWidth configs + properties', async t => {
    await setup({
      modes: {
        weekResources: {
          type: 'resource',
          title: 'Week resources',
          resourceWidth: 500,
          hideNonWorkingDays: true
        }
      }
    });
    t.hasWidth('.b-resourceview-resource', 500, 'resourceWidth config works');
    t.selectorNotExists('.b-resourceview-resource .b-nonworking-day', 'No working days');
    calendar.modes.weekResources.hideNonWorkingDays = false;
    t.selectorExists('.b-resourceview-resource .b-nonworking-day', 'property: No working days');
    calendar.modes.weekResources.resourceWidth = 800;
    t.hasWidth('.b-resourceview-resource', 800, 'resourceWidth property works');
  });

  if (DomHelper.scrollBarWidth) {
    t.it('Should hide and show the docked scroller as needed', async t => {
      await setup({
        modes: {
          weekResources: {
            type: 'resource',
            title: 'Week resources',
            resourceWidth: 500,
            hideNonWorkingDays: true,
            view: {
              dayStartTime: 8,
              dayEndTime: 20
            }
          }
        }
      });
      const {
        height
      } = calendar;
      t.notOk(calendar.modes.weekResources.dayViewScroller.isVisible, 'Fake vertical scroller not visible');
      calendar.height = 600;
      await t.waitFor(() => calendar.modes.weekResources.dayViewScroller.isVisible);
      t.pass('Fake vertical scroller shown');
      calendar.height = height;
      await t.waitFor(() => !calendar.modes.weekResources.dayViewScroller.isVisible);
      t.pass('Fake vertical scroller hidden');
    });
  }

  t.it('allDayEvents row heights must always be in sync', async t => {
    await setup({
      sidebar: false,
      modes: {
        weekResources: {
          type: 'resource',
          title: 'Week resources',
          resourceWidth: 400
        }
      },
      events: [{
        id: 11,
        name: 'Important event 1',
        resourceId: 1,
        startDate: '2021-09-13',
        endDate: '2021-09-14'
      }, {
        id: 12,
        name: 'Important event 2',
        resourceId: 1,
        startDate: '2021-09-13',
        endDate: '2021-09-14'
      }, {
        id: 13,
        name: 'Important event 3',
        resourceId: 1,
        startDate: '2021-09-13',
        endDate: '2021-09-14'
      }, {
        id: 14,
        name: 'Important event 4',
        resourceId: 1,
        startDate: '2021-09-13',
        endDate: '2021-09-14'
      }, {
        id: 21,
        name: 'Another event 1',
        resourceId: 2,
        startDate: '2021-09-13',
        endDate: '2021-09-14'
      }, {
        id: 22,
        name: 'Another event 2',
        resourceId: 2,
        startDate: '2021-09-13',
        endDate: '2021-09-14'
      }, {
        id: 23,
        name: 'Another event 3',
        resourceId: 2,
        startDate: '2021-09-13',
        endDate: '2021-09-14'
      }, {
        id: 24,
        name: 'Another event 4',
        resourceId: 2,
        startDate: '2021-09-13',
        endDate: '2021-09-14'
      }, {
        id: 25,
        name: 'Another event 5',
        resourceId: 2,
        startDate: '2021-09-13',
        endDate: '2021-09-14'
      }]
    });
    let allDayHeights = resourceView.items.map(v => v.allDayEvents.height); // Capture the height of the all day row in its default, collapsed state

    const collapsedHeight = allDayHeights[0]; // All day rows must always be same height

    for (let i = 0, {
      length
    } = allDayHeights; i < length - 1; i++) {
      t.is(allDayHeights[i], allDayHeights[i + 1]);
    } // Expand all day rows


    await t.click('.b-dayview-allday-row-start');
    await resourceView.items[0].allDayEvents.heightAnimation;
    allDayHeights = resourceView.items.map(v => v.allDayEvents.height); // Height must have grown to accommodate showing all the "allDay" events

    t.isGreater(allDayHeights[0], collapsedHeight); // All day rows must always be same height

    for (let i = 0, {
      length
    } = allDayHeights; i < length - 1; i++) {
      t.is(allDayHeights[i], allDayHeights[i + 1]);
    } // Collapse all day rows


    await t.click('.b-dayview-allday-row-start');
    await resourceView.items[0].allDayEvents.heightAnimation;
    allDayHeights = resourceView.items.map(v => v.allDayEvents.height); // Height must have dropped back to the collapsed height

    t.is(allDayHeights[0], collapsedHeight); // All day rows must always be same height

    for (let i = 0, {
      length
    } = allDayHeights; i < length - 1; i++) {
      t.is(allDayHeights[i], allDayHeights[i + 1]);
    }
  }); // https://github.com/bryntum/support/issues/3526

  t.it('Should support showing resourceView with list views', async t => {
    await setup({
      date: new Date(2021, 9, 1),
      sidebar: false,
      events: [{
        id: 1,
        name: 'Weekend',
        resourceId: 1,
        startDate: '2021-10-09',
        endDate: '2021-10-11'
      }, {
        id: 2,
        name: 'Working',
        resourceId: 1,
        startDate: '2021-10-11',
        endDate: '2021-10-12'
      }],
      modes: {
        weekResources: {
          type: 'resource',
          title: 'Week resources',
          hideNonWorkingDays: true,
          resourceWidth: 400,
          view: {
            type: 'list'
          }
        }
      }
    });
    await t.waitForSelector('.b-grid-cell:contains(Working)'); // TODO make event list respect hideNonWorkingDays and hide events
    // t.selectorNotExists('.b-grid-cell:contains(Weekend)');
  });
  t.it('Should support showing resourceView with agenda views', async t => {
    await setup({
      date: new Date(2021, 9, 1),
      sidebar: false,
      events: [{
        id: 1,
        name: 'Weekend',
        resourceId: 1,
        startDate: '2021-10-09',
        endDate: '2021-10-11'
      }, {
        id: 2,
        name: 'Working',
        resourceId: 1,
        startDate: '2021-10-11',
        endDate: '2021-10-12'
      }],
      modes: {
        weekResources: {
          type: 'resource',
          title: 'Week resources',
          // hideNonWorkingDays : true,
          resourceWidth: 400,
          view: {
            type: 'agenda'
          }
        }
      }
    });
    await t.waitForSelector('.b-grid-cell');
    t.elementIsNotVisible('.b-cal-widget-settings-button');
  });
  t.it('Filtered back in views should show correct dates', async t => {
    await setup({
      date: new Date(2021, 9, 11),
      events: [{
        id: 1,
        name: 'Weekend',
        resourceId: 1,
        startDate: '2021-10-10',
        endDate: '2021-10-11'
      }, {
        id: 2,
        name: 'Working',
        resourceId: 1,
        startDate: '2021-10-11',
        endDate: '2021-10-12'
      }],
      modes: {
        weekResources: {
          type: 'resource',
          title: 'Week resources'
        }
      }
    });
    t.selectorCountIs('.b-cal-event-wrap', 2, 'Bruce Wayne\'s events visible');
    await t.click('.b-list-item.b-selected:contains(Bruce Wayne)');
    t.selectorCountIs('.b-cal-event-wrap', 0, 'Bruce Wayne\'s events not present');
    await t.click('[data-ref="prevButton"]');
    await t.click('.b-list-item:not(.b-selected):contains(Bruce Wayne)');
    t.selectorCountIs('.b-cal-event-wrap', 0, 'Bruce Wayne\'s events not present at the new date');
  });
  t.it('Reloading data should work', async t => {
    await setup({
      date: new Date(2021, 9, 11),
      assignments: [{
        id: 1,
        eventId: 1,
        resourceId: 1
      }, {
        id: 2,
        eventId: 2,
        resourceId: 2
      }],
      events: [{
        id: 1,
        name: 'Weekend',
        startDate: '2021-10-10',
        endDate: '2021-10-11'
      }, {
        id: 2,
        name: 'Working',
        startDate: '2021-10-11',
        endDate: '2021-10-12'
      }],
      resources: [{
        id: 1,
        name: 'Resource 1'
      }, {
        id: 2,
        name: 'Resource 2'
      }],
      modes: {
        weekResources: {
          type: 'resource',
          title: 'Week resources'
        }
      }
    });
    t.selectorCountIs('.b-weekview .b-cal-event-wrap', 2);
    calendar.setConfig({
      assignments: [{
        id: 1,
        eventId: 1,
        resourceId: 1
      }, {
        id: 2,
        eventId: 2,
        resourceId: 2
      }],
      events: [{
        id: 1,
        name: 'New name 1',
        startDate: '2021-10-10',
        endDate: '2021-10-11'
      }, {
        id: 2,
        name: 'New name 2',
        startDate: '2021-10-11',
        endDate: '2021-10-12'
      }],
      resources: [{
        id: 1,
        name: 'Cal 1'
      }, {
        id: 2,
        name: 'Cal 2'
      }]
    });
    await t.waitForSelector('.b-resourceview-title:contains("Cal 1")');
    t.selectorCountIs('.b-weekview .b-cal-event-wrap:contains("New name 1")', 1);
    t.selectorCountIs('.b-weekview .b-cal-event-wrap:contains("New name 2")', 1);
    t.selectorCountIs('.b-resourcefilter .b-list-item:contains("Cal 1")', 1);
    t.selectorCountIs('.b-resourcefilter .b-list-item:contains("Cal 2")', 1);
    t.selectorCountIs('.b-resourceview-title:contains("Cal 1")', 1);
    t.selectorCountIs('.b-resourceview-title:contains("Cal 2")', 1);
  });
});