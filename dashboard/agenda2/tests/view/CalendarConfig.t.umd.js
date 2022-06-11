"use strict";

StartTest(t => {
  let calendar;
  t.beforeEach(() => {
    var _calendar;

    (_calendar = calendar) === null || _calendar === void 0 ? void 0 : _calendar.destroy();
  });
  t.it('Should turn calendar read only', async t => {
    calendar = new Calendar({
      appendTo: document.body,
      readOnly: true
    });
    t.is(calendar.widgetMap.resourceFilter.readOnly, false, 'Filter field should not be made readonly');
    await t.click('[data-ref="dayShowButton"]');
    await t.waitFor(() => calendar.mode === 'day');
    calendar.readOnly = false;
    await t.click('[data-ref="weekShowButton"]');
    await t.waitFor(() => calendar.mode === 'week');
    calendar.readOnly = true;
    await t.click('[data-ref="monthShowButton"]');
    await t.waitFor(() => calendar.mode === 'month');
  }); // https://github.com/bryntum/support/issues/2994

  t.it('Should support configuring defaultCalendar on calendar config object', async t => {
    calendar = new Calendar({
      appendTo: document.body,
      defaultCalendar: 'r1',
      project: {
        resourcesData: [{
          id: 'r1',
          name: 'default'
        }, {
          id: 'r2',
          name: 'Resource 2'
        }]
      }
    });
    t.is(calendar.defaultCalendar.name, 'default', 'Default calendar configured');
    t.is(calendar.activeView.defaultCalendar.name, 'default', 'Default calendar configured');
  }); // https://github.com/bryntum/support/issues/2994

  t.it('Should support configuring defaultCalendar on calendar config if data loaded remotely', async t => {
    t.mockUrl('data', {
      delay: 100,
      responseText: JSON.stringify({
        success: true,
        resources: {
          rows: [{
            id: 1
          }, {
            id: 2,
            name: 'default'
          }]
        },
        events: {
          rows: []
        }
      })
    });
    calendar = new Calendar({
      date: new Date(2019, 9, 14),
      appendTo: document.body,
      defaultCalendar: 2,
      crudManager: {
        autoLoad: true,
        transport: {
          load: {
            url: 'data'
          }
        }
      }
    });
    await t.waitFor(500);
    t.is(calendar.resourceStore.count, 2, '2 resources loaded');
    t.is(calendar.defaultCalendar.id, 2, 'Default calendar configured on Calendar');
    t.is(calendar.activeView.defaultCalendar.name, 'default', 'Default calendar configured on activeView');
  });
});