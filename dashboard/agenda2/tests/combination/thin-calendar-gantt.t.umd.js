"use strict";

StartTest(t => {
  t.beforeEach(() => Calendar.destroy(...Calendar.queryAll(w => !w.parent)));
  t.it('Calendar + Gantt with thin bundle sanity', async t => {
    const project = new ProjectModel({
      tasks: [{
        id: 1,
        name: 'Parent 1',
        expanded: true,
        children: [{
          id: 2,
          name: 'Event 1',
          startDate: '2022-02-11T8',
          duration: 5,
          durationUnit: 'h'
        }, {
          id: 3,
          name: 'Event 2',
          startDate: '2022-02-11T8',
          duration: 5,
          durationUnit: 'h'
        }]
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
    new Gantt({
      appendTo: document.body,
      width: 1000,
      height: 350,
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
    await t.waitForSelector('.b-gantt-task'); // Ensure something rendered

    t.selectorExists('.b-gantt-task', 'Gantt task rendered');
    t.selectorCountIs('.b-cal-event', 2, 'Calendar events rendered (no parent)'); // Ensure css worked

    t.isApproxPx(t.rect('.b-gantt-task').left, 811, 2, 'Task has correct x');
    t.hasApproxWidth('.b-gantt-task', 23, 2, 'Task has correct width');
    t.isApproxPx(t.rect('.b-cal-event').left, 736, 2, 'Calendar event has correct x');
    t.hasApproxWidth('.b-cal-event', 66, 2, 'Calendar event has correct width');
    await t.doubleClick('.b-cal-event');
    await t.click('[data-ref=nameField] input');
    await t.type({
      text: 'Testing[ENTER]',
      clearExisting: true
    });
    await t.waitForSelector('.b-gantt .b-grid-cell:textEquals(Testing)');
    await t.waitForSelector('.b-cal-event-desc:textEquals(Testing)');
    t.pass('Editing worked');
  });
});