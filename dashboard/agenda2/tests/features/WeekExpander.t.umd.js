"use strict";

StartTest(t => {
  let calendar, eventStore, resourceStore;
  t.beforeEach(() => {
    var _calendar;

    return (_calendar = calendar) === null || _calendar === void 0 ? void 0 : _calendar.destroy();
  });
  t.it('WeekExpander feature', async t => {
    var _calendar$modes$month;

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
      eventStore,
      resourceStore,
      date: new Date(2019, 9, 14),
      sidebar: null,
      mode: 'month',
      modes: {
        month: {
          minRowHeight: '3ev'
        }
      },
      features: {
        weekExpander: true
      }
    });
    const weekRow = calendar.modes.month.weekElements[2],
          flexedHeight = weekRow.offsetHeight;
    t.notOk((_calendar$modes$month = calendar.modes.month.scrollable) === null || _calendar$modes$month === void 0 ? void 0 : _calendar$modes$month.hasOverflow(), 'No overflow in normal flexing mode');
    await t.click('[data-week="2019,42"] .b-week-toggle-tool'); // It's been shrinkwrapped

    await t.waitForSelector('[data-week="2019,42"].b-shrinkwrapped'); // Wait for the transition to finish

    await t.waitForAnimations();
    t.isGreater(weekRow.offsetHeight, flexedHeight);
    t.ok(calendar.modes.month.scrollable.hasOverflow(), 'Overflow when week expanded'); // Also expand week 43

    await t.click('[data-week="2019,43"] .b-week-toggle-tool'); // It's been shrinkwrapped

    await t.waitForSelector('[data-week="2019,43"].b-shrinkwrapped'); // Wait for the transition to finish

    await t.waitForAnimations(); // https://github.com/bryntum/support/issues/3696
    // Must be *two* shrinkwrapped rows now

    t.selectorCountIs('.b-shrinkwrapped', 2);
    /*
     * Now flex both weeks 42 and 43 back to default height
     */

    await t.click('[data-week="2019,42"] .b-week-toggle-tool'); // It's been flexed

    await t.waitForSelector('[data-week="2019,42"]:not(.b-shrinkwrapped)'); // Wait for the transition to finish

    await t.waitForAnimations();
    t.selectorCountIs('.b-shrinkwrapped', 1);
    await t.click('[data-week="2019,43"] .b-week-toggle-tool'); // It's been flexed

    await t.waitForSelector('[data-week="2019,43"]:not(.b-shrinkwrapped)'); // Wait for the transition to finish

    await t.waitForAnimations();
    t.selectorCountIs('.b-shrinkwrapped', 0);
    /*
     * Now expand using the "+n more" overflow button
     */

    calendar.modes.month.overflowClickAction = 'expand';
    await t.click('[data-date="2019-10-14"] .b-cal-cell-overflow'); // It's been shrinkwrapped

    await t.waitForSelector('[data-week="2019,42"].b-shrinkwrapped'); // Wait for the transition to finish

    await t.waitForAnimations();
    t.isGreater(weekRow.offsetHeight, flexedHeight);
    t.ok(calendar.modes.month.scrollable.hasOverflow(), 'Overflow when week expanded');
    await t.click('[data-week="2019,42"] .b-week-toggle-tool'); // It's been flexed

    await t.waitForSelector('[data-week="2019,42"]:not(.b-shrinkwrapped)'); // Wait for the transition to finish

    await t.waitForAnimations();
    t.notOk(calendar.modes.month.scrollable.hasOverflow(), 'No overflow in normal flexing mode');
    t.is(weekRow.offsetHeight, flexedHeight);
    /*
     * autoRowHeight must override and disable WeekExpander
     */

    calendar.modes.month.autoRowHeight = true; // Wait for the transition to finish

    await t.waitForAnimations();
    t.selectorCountIs('.b-shrinkwrapped', 6, 'All rows shrinkwrapped');
    t.ok(calendar.modes.month.scrollable.hasOverflow(), 'Overflow when week autoHeight : true');
    t.ok(calendar.features.weekExpander.disabled, 'WeekExpander must be disabled when autoRowHeight set');
    calendar.modes.month.autoRowHeight = false; // Wait for the transition to finish

    await t.waitForAnimations();
    t.selectorCountIs('.b-shrinkwrapped', 0, 'No rows shrinkwrapped');
    await t.waitFor(() => !calendar.modes.month.scrollable.hasOverflow());
    t.notOk(calendar.modes.month.scrollable.hasOverflow(), 'No overflow when week autoHeight : false');
    t.notOk(calendar.features.weekExpander.disabled, 'WeekExpander must be re-enabled when autoRowHeight unset');
    calendar.modes.month.autoRowHeight = true; // Wait for the transition to finish

    await t.waitForAnimations();
    t.selectorCountIs('.b-shrinkwrapped', 6, 'All rows shrinkwrapped');
    t.ok(calendar.modes.month.scrollable.hasOverflow(), 'Overflow when week autoHeight : true');
    await t.click('[data-ref="nextButton"]'); // Wait for the transition to finish

    await t.waitForAnimations();
    t.selectorCountIs('.b-shrinkwrapped', 6, 'All rows shrinkwrapped');
    await t.waitFor(() => !calendar.modes.month.scrollable.hasOverflow());
    await t.click('[data-ref="prevButton"]'); // Wait for the transition to finish

    await t.waitForAnimations();
    t.selectorCountIs('.b-shrinkwrapped', 6, 'All rows shrinkwrapped');
    await t.waitFor(() => calendar.modes.month.scrollable.hasOverflow());
  });
});