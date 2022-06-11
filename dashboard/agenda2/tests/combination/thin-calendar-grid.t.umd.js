"use strict";

StartTest(t => {
  t.beforeEach(() => Grid.destroy(...Grid.queryAll(w => !w.parent)));
  t.it('Calendar + Grid with thin bundle sanity', async t => {
    const project = new ProjectModel({
      events: [{
        id: 1,
        name: 'Event 1',
        startDate: '2022-02-11T8',
        duration: 2,
        durationUnit: 'h'
      }],
      resources: [{
        id: 1,
        name: 'Resource 1'
      }],
      assignments: [{
        id: 1,
        eventId: 1,
        resourceId: 1
      }]
    });
    new Grid({
      appendTo: document.body,
      width: 1000,
      height: 350,
      columns: [{
        field: 'name',
        text: 'Event',
        width: 100
      }, {
        type: 'date',
        field: 'startDate',
        text: 'Start'
      }],
      store: project.eventStore
    });
    new Calendar({
      appendTo: document.body,
      width: 1000 + DomHelper.scrollBarWidth,
      height: 350,
      date: new Date(2022, 1, 11),
      sidebar: null,
      project
    });
    await t.waitForSelector('.b-cal-event'); // Ensure something rendered

    t.selectorExists('.b-grid .b-grid-row', 'Grid row rendered'); // Ensure css worked

    t.hasApproxHeight('.b-grid .b-grid-cell', 45, 2, 'Grid row has height');
    t.hasApproxWidth('.b-grid .b-grid-cell', 100, 2, 'Grid cell has width');
    t.isApproxPx(t.rect('.b-cal-event').left, 736, 2, 'Event has correct x');
    t.hasApproxWidth('.b-cal-event', 128, 2, 'Event has correct width');
    await t.dragBy({
      source: '.b-cal-event',
      delta: [-128, 0]
    });
    t.isApproxPx(t.rect('.b-cal-event').left, 603, 2, 'Event has correct x after drag'); // FF seems to not always update immediately

    await t.waitForSelector('.b-grid .b-grid-cell:textEquals(02/10/2022)');
    t.pass('Grid cell updated');
  });
});