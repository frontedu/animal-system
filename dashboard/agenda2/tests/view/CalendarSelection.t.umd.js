"use strict";

/* eslint-disable quote-props */
StartTest(t => {
  // Safari fails this test when on TC
  if (t.bowser.safari) {
    return;
  } // eslint-disable-next-line no-unused-vars


  let calendar, eventStore, resourceStore, agenda, year, month, week, day, hackathon, relax, roadMap, review;

  function objectsMatch(t, a, b) {
    t.isStrict(a.length, b.length, 'Array lengths match');
    a.forEach((ea, i) => t.isStrict(ea, b[i], `Element ${i} matches`));
  }

  async function getCalendar(config) {
    const calendar = await t.getCalendar(Object.assign({
      features: {
        eventTooltip: false
      }
    }, config));
    eventStore = calendar.eventStore;
    resourceStore = calendar.resourceStore; // eslint-disable-next-line no-unused-vars

    ({
      agenda,
      year,
      month,
      week,
      day
    } = calendar.modes);
    hackathon = calendar.eventStore.find(r => r.name === 'Hackathon 2019');
    relax = calendar.eventStore.find(r => r.name === 'Relax and official arrival beer');
    roadMap = eventStore.find(r => r.name === 'Roadmapping for 2020');
    review = eventStore.find(r => r.name === 'Review Assembla tickets and decide features to add');
    return calendar;
  }

  t.beforeEach(t => {
    var _calendar;

    (_calendar = calendar) === null || _calendar === void 0 ? void 0 : _calendar.destroy(); // Check that none of the floating things are persisting

    if (t.query('.b-overflowpopup,.b-sch-event-tooltip, .b-eventeditor').length > 0) {
      t.selectorNotExists('.b-overflowpopup:visible');
      t.selectorNotExists('.b-sch-event-tooltip');
      t.selectorNotExists('.b-eventeditor');
    } // Some of these tests occasionally fail in turbo mode.


    t.simulator.setSpeed('speedRun');
  });
  t.afterEach(t => {
    t.simulator.setSpeed('turboMode');
  });
  t.it('Should select single events on click in all day row', async t => {
    eventStore = new EventStore({
      data: t.getHackathonData().events.rows
    });
    resourceStore = new ResourceStore({
      data: t.getHackathonData().resources.rows
    });
    calendar = await getCalendar({
      date: new Date(2019, 9, 14),
      eventStore,
      resourceStore
    });
    const selectionValidators = [function ({
      action,
      selection,
      selected,
      deselected
    }) {
      t.ok(action, 'select');
      objectsMatch(t, selection, [hackathon]);
      objectsMatch(t, selected, [hackathon]);
      objectsMatch(t, deselected, []);
    }, function ({
      action,
      selection,
      selected,
      deselected
    }) {
      t.ok(action, 'clear');
      objectsMatch(t, selection, []);
      objectsMatch(t, selected, []);
      objectsMatch(t, deselected, [hackathon]);
    }, function ({
      action,
      selection,
      selected,
      deselected
    }) {
      t.ok(action, 'update');
      objectsMatch(t, selection, [relax]);
      objectsMatch(t, selected, [relax]);
      objectsMatch(t, deselected, []);
    }];
    let selectionChangeCount = 0;
    calendar.on({
      selectionChange(e) {
        selectionValidators[selectionChangeCount](e);
        selectionChangeCount++;
      }

    });
    t.willFireNTimes(calendar, 'selectionChange', 3);
    t.chain({
      waitForEvent: [calendar, 'selectionChange'],
      trigger: {
        click: '.b-cal-event-wrap:contains(Hackathon 2019)'
      }
    }, next => {
      t.is(calendar.selectedEvents.length, 1, 'One event selected');
      t.is(calendar.selectedEvents[0].name, 'Hackathon 2019', 'Correct event selected');
      next();
    }, {
      waitForEvent: [calendar, 'selectionChange'],
      trigger: {
        type: '[DELETE]'
      }
    }, // "activeItem" must not be lost after a keyboard event delete
    {
      waitForSelector: '.b-cal-event-wrap.b-active'
    }, {
      waitFor: () => calendar.selectedEvents.length === 1
    }, () => {
      t.is(calendar.selectedEvents.length, 1, 'One event selected');
      t.is(calendar.selectedEvents[0].name, 'Relax and official arrival beer', 'Correct event selected');
      t.notOk(calendar.eventStore.includes(hackathon), 'Event correctly deleted');
      t.notOk(calendar.selectedEvents.includes(hackathon), 'Event correctly selected');
    });
  });
  t.it('Should select single events on click in day detail', async t => {
    eventStore = new EventStore({
      data: t.getHackathonData().events.rows
    });
    resourceStore = new ResourceStore({
      data: t.getHackathonData().resources.rows
    });
    calendar = await getCalendar({
      date: new Date(2019, 9, 14),
      eventStore,
      resourceStore
    });
    const selectionValidators = [function ({
      action,
      selection,
      selected,
      deselected
    }) {
      t.ok(action, 'select');
      objectsMatch(t, selection, [roadMap]);
      objectsMatch(t, selected, [roadMap]);
      objectsMatch(t, deselected, []);
    }, function ({
      action,
      selection,
      selected,
      deselected
    }) {
      t.ok(action, 'clear');
      objectsMatch(t, selection, []);
      objectsMatch(t, selected, []);
      objectsMatch(t, deselected, [roadMap]);
    }, function ({
      action,
      selection,
      selected,
      deselected
    }) {
      t.ok(action, 'update');
      objectsMatch(t, selection, [review]);
      objectsMatch(t, selected, [review]);
      objectsMatch(t, deselected, []);
    }];
    let selectionChangeCount = 0;
    calendar.on({
      selectionChange(e) {
        selectionValidators[selectionChangeCount](e);
        selectionChangeCount++;
      }

    });
    t.willFireNTimes(calendar, 'selectionChange', 3);
    t.chain({
      waitForEvent: [calendar, 'selectionChange'],
      trigger: {
        click: '.b-cal-event-wrap:contains(Roadmapping for 2020)'
      }
    }, next => {
      t.is(calendar.selectedEvents.length, 1, 'One event selected');
      t.is(calendar.selectedEvents[0].name, 'Roadmapping for 2020', 'Correct event selected');
      next();
    }, {
      waitForEvent: [calendar, 'selectionChange'],
      trigger: {
        type: '[DELETE]'
      }
    }, // "activeItem" must not be lost after a keyboard event delete
    {
      waitForSelector: '.b-cal-event-wrap.b-active'
    }, {
      waitFor: () => calendar.selectedEvents.length === 1
    }, () => {
      t.is(calendar.selectedEvents.length, 1, 'One event selected');
      t.is(calendar.selectedEvents[0].name, 'Review Assembla tickets and decide features to add', 'Correct event selected');
      t.notOk(calendar.eventStore.includes(roadMap), 'Event correctly deleted');
      t.notOk(calendar.selectedEvents.includes(roadMap), 'Event correctly selected');
    });
  });
  t.it('Should select single events on click in a month cell', async t => {
    eventStore = new EventStore({
      data: t.getHackathonData().events.rows
    });
    resourceStore = new ResourceStore({
      data: t.getHackathonData().resources.rows
    });
    calendar = await getCalendar({
      date: new Date(2019, 9, 14),
      eventStore,
      resourceStore,
      mode: 'month'
    });
    const selectionValidators = [function ({
      action,
      selection,
      selected,
      deselected
    }) {
      t.ok(action, 'select');
      objectsMatch(t, selection, [hackathon]);
      objectsMatch(t, selected, [hackathon]);
      objectsMatch(t, deselected, []);
    }, function ({
      action,
      selection,
      selected,
      deselected
    }) {
      t.ok(action, 'clear');
      objectsMatch(t, selection, []);
      objectsMatch(t, selected, []);
      objectsMatch(t, deselected, [hackathon]);
    }, function ({
      action,
      selection,
      selected,
      deselected
    }) {
      t.ok(action, 'update');
      objectsMatch(t, selection, [relax]);
      objectsMatch(t, selected, [relax]);
      objectsMatch(t, deselected, []);
    }];
    let selectionChangeCount = 0;
    calendar.on({
      selectionChange(e) {
        selectionValidators[selectionChangeCount](e);
        selectionChangeCount++;
      }

    });
    t.willFireNTimes(calendar, 'selectionChange', 3);
    t.chain({
      waitForEvent: [calendar, 'selectionChange'],
      trigger: {
        click: '.b-cal-event-wrap:contains(Hackathon 2019)'
      }
    }, next => {
      t.is(calendar.selectedEvents.length, 1, 'One event selected');
      t.is(calendar.selectedEvents[0].name, 'Hackathon 2019', 'Correct event selected');
      next();
    }, {
      waitForEvent: [calendar, 'selectionChange'],
      trigger: {
        type: '[DELETE]'
      }
    }, // "activeItem" must not be lost after a keyboard event delete
    {
      waitForSelector: '.b-cal-event-wrap.b-active'
    }, {
      waitFor: () => calendar.selectedEvents.length === 1
    }, () => {
      t.is(calendar.selectedEvents.length, 1, 'One event selected');
      t.is(calendar.selectedEvents[0].name, 'Relax and official arrival beer', 'Correct event selected');
      t.notOk(calendar.eventStore.includes(hackathon), 'Event correctly deleted');
      t.notOk(calendar.selectedEvents.includes(hackathon), 'Event correctly selected');
    });
  });
  t.it('Should select single events on click in a month overflow popup', async t => {
    eventStore = new EventStore({
      data: t.getHackathonData().events.rows
    });
    resourceStore = new ResourceStore({
      data: t.getHackathonData().resources.rows
    });
    calendar = await getCalendar({
      date: new Date(2019, 9, 14),
      eventStore,
      resourceStore,
      mode: 'month'
    });
    const selectionValidators = [function ({
      action,
      selection,
      selected,
      deselected
    }) {
      t.ok(action, 'select');
      objectsMatch(t, selection, [hackathon]);
      objectsMatch(t, selected, [hackathon]);
      objectsMatch(t, deselected, []);
    }, function ({
      action,
      selection,
      selected,
      deselected
    }) {
      t.ok(action, 'update');
      objectsMatch(t, selection, [roadMap]);
      objectsMatch(t, selected, [roadMap]);
      objectsMatch(t, deselected, [hackathon]);
    }, function ({
      action,
      selection,
      selected,
      deselected
    }) {
      t.ok(action, 'clear');
      objectsMatch(t, selection, []);
      objectsMatch(t, selected, []);
      objectsMatch(t, deselected, [roadMap]);
    }, function ({
      action,
      selection,
      selected,
      deselected
    }) {
      t.ok(action, 'update');
      objectsMatch(t, selection, [review]);
      objectsMatch(t, selected, [review]);
      objectsMatch(t, deselected, []);
    }, function ({
      action,
      selection,
      selected,
      deselected
    }) {
      t.ok(action, 'clear');
      objectsMatch(t, selection, []);
      objectsMatch(t, selected, []);
      objectsMatch(t, deselected, [review]);
    }];
    let selectionChangeCount = 0;
    calendar.on({
      selectionChange(e) {
        selectionValidators[selectionChangeCount](e);
        selectionChangeCount++;
      }

    });
    t.willFireNTimes(calendar, 'selectionChange', 5);
    t.chain({
      // Wait for focus to be on an event inside the popup
      waitFor: () => {
        var _calendar$modes$month;

        return ((_calendar$modes$month = calendar.modes.month._overflowPopup) === null || _calendar$modes$month === void 0 ? void 0 : _calendar$modes$month.containsFocus) && t.query('.b-cal-event-wrap.b-active', calendar.modes.month.overflowPopup.element);
      },
      trigger: {
        click: '[data-date="2019-10-16"] .b-cal-cell-overflow'
      }
    }, {
      waitForEvent: [calendar, 'selectionChange'],
      trigger: {
        click: '.b-cal-event-wrap:contains(Roadmapping for 2020)'
      }
    }, next => {
      t.is(calendar.selectedEvents.length, 1, 'One event selected');
      t.is(calendar.selectedEvents[0].name, 'Roadmapping for 2020', 'Correct event selected');
      next();
    }, {
      waitForEvent: [calendar, 'selectionChange'],
      trigger: {
        type: '[DELETE]'
      }
    }, // "activeItem" must not be lost after a keyboard event delete
    {
      waitForSelector: '.b-cal-event-wrap.b-active'
    }, {
      waitFor: () => calendar.selectedEvents.length === 1
    }, next => {
      t.is(calendar.selectedEvents.length, 1, 'One event selected');
      t.is(calendar.selectedEvents[0].name, 'Review Assembla tickets and decide features to add', 'Correct event selected');
      t.notOk(calendar.eventStore.includes(roadMap), 'Event correctly deleted');
      t.notOk(calendar.selectedEvents.includes(roadMap), 'Event correctly selected');
      next();
    }, {
      waitFor: () => document.activeElement === document.querySelector('[data-date="2019-10-16"] .b-cal-cell-overflow'),
      trigger: {
        type: '[ESCAPE]'
      }
    });
  });
  t.it('Should select single events on click in a year overflow popup', async t => {
    eventStore = new EventStore({
      data: t.getHackathonData().events.rows.concat([{
        startDate: '2019-10-22',
        endDate: '2019-10-23',
        name: 'Lone event',
        id: 'lone-event'
      }])
    });
    resourceStore = new ResourceStore({
      data: t.getHackathonData().resources.rows
    });
    calendar = await getCalendar({
      date: new Date(2019, 9, 14),
      eventStore,
      resourceStore,
      sidebar: false,
      mode: 'year'
    });
    const loneEvent = eventStore.getById('lone-event');
    const selectionValidators = [function ({
      action,
      selection,
      selected,
      deselected
    }) {
      t.ok(action, 'select');
      objectsMatch(t, selection, [hackathon]);
      objectsMatch(t, selected, [hackathon]);
      objectsMatch(t, deselected, []);
    }, function ({
      action,
      selection,
      selected,
      deselected
    }) {
      t.ok(action, 'update');
      objectsMatch(t, selection, [roadMap]);
      objectsMatch(t, selected, [roadMap]);
      objectsMatch(t, deselected, [hackathon]);
    }, function ({
      action,
      selection,
      selected,
      deselected
    }) {
      t.ok(action, 'clear');
      objectsMatch(t, selection, []);
      objectsMatch(t, selected, []);
      objectsMatch(t, deselected, [roadMap]);
    }, function ({
      action,
      selection,
      selected,
      deselected
    }) {
      t.ok(action, 'update');
      objectsMatch(t, selection, [review]);
      objectsMatch(t, selected, [review]);
      objectsMatch(t, deselected, []);
    }, function ({
      action,
      selection,
      selected,
      deselected
    }) {
      t.ok(action, 'update');
      objectsMatch(t, selection, [loneEvent]);
      objectsMatch(t, selected, [loneEvent]);
      objectsMatch(t, deselected, [review]);
    }, function ({
      action,
      selection,
      selected,
      deselected
    }) {
      t.ok(action, 'clear');
      objectsMatch(t, selection, []);
      objectsMatch(t, selected, []);
      objectsMatch(t, deselected, [loneEvent]);
    }];
    let selectionChangeCount = 0;
    calendar.on({
      selectionChange(e) {
        selectionValidators[selectionChangeCount](e);
        selectionChangeCount++;
      }

    });
    t.willFireNTimes(calendar, 'selectionChange', 6);
    t.chain({
      // Wait for focus to be on an event inside the popup
      waitFor: () => {
        var _calendar$modes$year$;

        return ((_calendar$modes$year$ = calendar.modes.year._overflowPopup) === null || _calendar$modes$year$ === void 0 ? void 0 : _calendar$modes$year$.containsFocus) && t.query('.b-cal-event-wrap.b-active', calendar.modes.year.overflowPopup.element);
      },
      trigger: {
        click: '[data-date="2019-10-16"].b-cal-cell-overflow'
      }
    }, {
      waitForEvent: [calendar, 'selectionChange'],
      trigger: {
        click: '.b-cal-event-wrap:contains(Roadmapping for 2020)'
      }
    }, next => {
      t.is(calendar.selectedEvents.length, 1, 'One event selected');
      t.is(calendar.selectedEvents[0].name, 'Roadmapping for 2020', 'Correct event selected');
      next();
    }, {
      waitForEvent: [calendar, 'selectionChange'],
      trigger: {
        type: '[DELETE]'
      }
    }, // "activeItem" must not be lost after a keyboard event delete
    {
      waitForSelector: '.b-cal-event-wrap.b-active'
    }, {
      waitFor: () => calendar.selectedEvents.length === 1
    }, next => {
      t.is(calendar.selectedEvents.length, 1, 'One event selected');
      t.is(calendar.selectedEvents[0].name, 'Review Assembla tickets and decide features to add', 'Correct event selected');
      t.notOk(calendar.eventStore.includes(roadMap), 'Event correctly deleted');
      t.notOk(calendar.selectedEvents.includes(roadMap), 'Event correctly selected');
      next();
    }, {
      // Wait for first and only event in popup to be selected
      waitForEvent: [calendar, 'selectionChange'],
      trigger: {
        click: '[data-date="2019-10-22"].b-cal-cell-overflow'
      }
    }, // Focus must be in the popup
    {
      waitFor: () => {
        var _calendar$modes$year$2;

        return ((_calendar$modes$year$2 = calendar.modes.year._overflowPopup) === null || _calendar$modes$year$2 === void 0 ? void 0 : _calendar$modes$year$2.containsFocus) && t.query('.b-cal-event-wrap.b-active', calendar.modes.year.overflowPopup.element);
      }
    }, next => {
      t.is(calendar.selectedEvents.length, 1, 'One event selected');
      t.is(calendar.selectedEvents[0].name, 'Lone event', 'Correct event selected');
      next();
    }, // Deleting right now leaves focus with nowhere to go.
    // YearView is not yet keyboard-navigable.
    // It must not throw.
    {
      waitForEvent: [calendar, 'selectionChange'],
      trigger: {
        type: '[DELETE]'
      }
    }, // Popup must have hidden
    {
      waitFor: () => !calendar.modes.year.overflowPopup.isVisible
    });
  });
  t.it('Should select single events on click in agenda view', async t => {
    eventStore = new EventStore({
      data: t.getHackathonData().events.rows
    });
    resourceStore = new ResourceStore({
      data: t.getHackathonData().resources.rows
    });
    calendar = await getCalendar({
      eventStore,
      resourceStore,
      date: new Date(2019, 9, 14),
      mode: 'agenda',
      features: {
        eventTooltip: false
      }
    });
    const selectionValidators = [function ({
      action,
      selection,
      selected,
      deselected
    }) {
      t.ok(action, 'select');
      objectsMatch(t, selection, [roadMap]);
      objectsMatch(t, selected, [roadMap]);
      objectsMatch(t, deselected, []);
    }, function ({
      action,
      selection,
      selected,
      deselected
    }) {
      t.ok(action, 'clear');
      objectsMatch(t, selection, []);
      objectsMatch(t, selected, []);
      objectsMatch(t, deselected, [roadMap]);
    }, function ({
      action,
      selection,
      selected,
      deselected
    }) {
      t.ok(action, 'update');
      objectsMatch(t, selection, [review]);
      objectsMatch(t, selected, [review]);
      objectsMatch(t, deselected, []);
    }];
    let selectionChangeCount = 0;
    calendar.on({
      selectionChange(e) {
        selectionValidators[selectionChangeCount](e);
        selectionChangeCount++;
      }

    });
    t.willFireNTimes(calendar, 'selectionChange', 3);
    t.chain({
      waitForEvent: [calendar, 'selectionChange'],
      trigger: {
        click: '.b-cal-event-wrap:contains(Roadmapping for 2020)'
      }
    }, next => {
      t.is(calendar.selectedEvents.length, 1, 'One event selected');
      t.is(calendar.selectedEvents[0].name, 'Roadmapping for 2020', 'Correct event selected');
      next();
    }, {
      waitForEvent: [calendar, 'selectionChange'],
      trigger: {
        type: '[DELETE]'
      }
    }, // "activeItem" must not be lost after a keyboard event delete
    {
      waitForSelector: '.b-cal-event-wrap.b-active'
    }, {
      waitFor: () => calendar.selectedEvents.length === 1
    }, () => {
      t.is(calendar.selectedEvents.length, 1, 'One event selected');
      t.is(calendar.selectedEvents[0].name, 'Review Assembla tickets and decide features to add', 'Correct event selected');
      t.notOk(calendar.eventStore.includes(roadMap), 'Event correctly deleted');
      t.notOk(calendar.selectedEvents.includes(roadMap), 'Event correctly selected');
    });
  });
});