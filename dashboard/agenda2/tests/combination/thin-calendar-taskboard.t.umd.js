"use strict";

StartTest(t => {
  t.beforeEach(() => TaskBoard.destroy(...TaskBoard.queryAll(w => !w.parent)));
  t.it('Calendar + TaskBoard with thin bundle sanity', async t => {
    const project = new ProjectModel({
      events: [{
        id: 1,
        name: 'Event 1',
        startDate: '2022-02-11T8',
        duration: 2,
        durationUnit: 'h',
        status: 'todo'
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
    new TaskBoard({
      appendTo: document.body,
      width: 1000,
      height: 350,
      columns: ['todo', 'done'],
      columnField: 'status',
      project
    });
    new Calendar({
      appendTo: document.body,
      width: 1000 + DomHelper.scrollBarWidth,
      height: 350,
      date: new Date(2022, 1, 11),
      sidebar: null,
      project
    });
    await t.waitForSelector('.b-cal-event');
    await t.waitForSelector('.b-taskboard-card'); // Ensure something rendered

    t.selectorExists('.b-taskboard-card', 'TaskBoard card rendered');
    t.selectorExists('.b-cal-event', 'Calendar event rendered'); // Ensure css worked

    t.hasApproxHeight('.b-taskboard-card', 99, 2, 'Card has height');
    t.hasApproxWidth('.b-taskboard-card', 460, 2, 'Card has width');
    t.isApproxPx(t.rect('.b-cal-event').left, 736, 2, 'Event has correct x');
    t.hasApproxWidth('.b-cal-event', 128, 2, 'Event has correct width');
    await t.doubleClick('.b-cal-event');
    await t.click('[data-ref=nameField] input');
    await t.type({
      text: 'Testing[ENTER]',
      clearExisting: true
    });
    await t.waitForSelector('.b-taskboard-card-header:textEquals(Testing)');
    await t.waitForSelector('.b-cal-event-desc:textEquals(Testing)');
    t.pass('Editing worked');
  });
});