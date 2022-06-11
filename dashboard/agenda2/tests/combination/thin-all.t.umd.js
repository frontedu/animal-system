"use strict";

StartTest(t => {
  t.beforeEach(() => Grid.destroy(...Grid.queryAll(w => !w.parent)));
  t.it('All thin bundle sanity', async t => {
    document.body.style.fontSize = '10px';
    const project = new ProjectModel({
      tasks: [{
        id: 1,
        name: 'Event 1',
        startDate: '2022-02-11',
        duration: 5,
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
    new Grid({
      appendTo: document.body,
      ref: 'grid',
      width: 1024,
      height: 150,
      columns: [{
        field: 'name',
        text: 'Task',
        width: 100
      }, {
        field: 'status',
        text: 'Status'
      }],
      store: project.taskStore
    });
    new TaskBoard({
      appendTo: document.body,
      ref: 'taskboard',
      width: 1024,
      height: 150,
      features: {
        columnToolbars: false
      },
      columns: ['todo', 'done'],
      columnField: 'status',
      project
    });
    new Calendar({
      appendTo: document.body,
      ref: 'calendar',
      width: 1024,
      height: 200,
      date: new Date(2022, 1, 11),
      sidebar: null,
      project
    });
    new Scheduler({
      appendTo: document.body,
      ref: 'scheduler',
      width: 1024,
      height: 150,
      startDate: new Date(2022, 1, 11),
      endDate: new Date(2022, 2, 1),
      tickSize: 50,
      columns: [{
        field: 'name',
        text: 'Resource',
        width: 100
      }],
      project
    });
    new SchedulerPro({
      appendTo: document.body,
      ref: 'pro',
      width: 1024,
      height: 150,
      startDate: new Date(2022, 1, 11),
      endDate: new Date(2022, 2, 1),
      tickSize: 50,
      columns: [{
        field: 'name',
        text: 'Resource',
        width: 100
      }],
      project
    });
    new Gantt({
      appendTo: document.body,
      ref: 'gantt',
      width: 1024,
      height: 150,
      project
    }); // These are not rendered in sync

    await t.waitForSelector('.b-taskboard-card');
    await t.waitForSelector('.b-cal-event');
    t.selectorExists('[data-ref=grid] .b-grid-cell:textEquals(Event 1)', 'Grid cell found');
    t.selectorExists('[data-ref=taskboard] .b-taskboard-card-header:textEquals(Event 1)', 'TaskBoard card found');
    t.selectorExists('[data-ref=calendar] .b-cal-event-desc:textEquals(Event 1)', 'Calendar event found');
    t.selectorExists('[data-ref=pro] .b-sch-event:textEquals(Event 1)', 'Pro event found');
    t.selectorExists('[data-ref=gantt] .b-grid-cell:textEquals(Event 1)', 'Gantt task found');
    await t.doubleClick('[data-ref=grid] .b-grid-cell:textEquals(Event 1)');
    await t.type(null, 'Task[ENTER]');
    await t.waitForSelector('.b-taskboard-card-header:textEquals(Task)');
    t.selectorExists('[data-ref=grid] .b-grid-cell:textEquals(Task)', 'Grid cell updated');
    t.selectorExists('[data-ref=taskboard] .b-taskboard-card-header:textEquals(Task)', 'TaskBoard card updated');
    t.selectorExists('[data-ref=calendar] .b-cal-event-desc:textEquals(Task)', 'Calendar event updated');
    t.selectorExists('[data-ref=pro] .b-sch-event:textEquals(Task)', 'Pro event updated');
    t.selectorExists('[data-ref=gantt] .b-grid-cell:textEquals(Task)', 'Gantt task updated');
    await t.rightClick('[data-ref=grid] .b-grid-cell');
    await t.click('[data-ref=removeRow]');
    await t.waitForSelectorNotFound('.b-taskboard-card');
    t.selectorNotExists('[data-ref=grid] .b-grid-cell', 'Grid row removed');
    t.selectorNotExists('[data-ref=taskboard] .b-taskboard-card', 'TaskBoard card removed');
    t.selectorNotExists('[data-ref=calendar] .b-cal-event', 'Calendar event removed');
    t.selectorNotExists('[data-ref=pro] .b-sch-event-wrap', 'Pro event removed');
    t.selectorNotExists('[data-ref=gantt] .b-grid-cell', 'Gantt task removed');
  });
});