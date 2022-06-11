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
  t.it('With inline data', async t => {
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
    calendar = await getCalendar({
      date: new Date(2019, 9, 14),
      eventStore,
      resourceStore,
      modes: {
        day: null,
        week: null,
        month: null,
        year: null,
        agenda: null,
        weekResources: {
          type: 'resourceView',
          title: 'Week resources',
          view: {
            minWidth: '16em',
            hideNonWorkingDays: true,
            dayStartTime: 8
          }
        },
        monthResources: {
          type: 'resourceView',
          title: 'Month resources',
          view: {
            type: 'monthview',
            minWidth: '16em',
            hideNonWorkingDays: true
          }
        }
      }
    });
    await t.waitForProjectReady(calendar);
    const resourceView = calendar.activeView,
          bryntumView = resourceView.items[1],
          matsView = resourceView.items[3],
          checkIn = calendar.eventStore.getById(2),
          excursion = calendar.eventStore.getById(18),
          itemCount = resourceView.items.length,
          {
      hourHeight
    } = calendar.modes.weekResources.items[0]; // WeekViews have one extra item as the time axis, and another trailing one as the
    // scrollbar *if there are visible scrollbars*.

    t.is(itemCount, calendar.resourceStore.count + 1 + (DomHelper.scrollBarWidth ? 1 : 0)); // Start resource correct, and it's not an all day event

    t.is(checkIn.resourceId, 'hotel');
    t.notOk(checkIn.allDay); // drag "Check In" across to be an all day event for the Bryntum Team

    await t.dragTo('[data-event-id="2"]', `#${bryntumView.id} .b-dayview-allday.b-calendar-cell[data-date="2019-10-17"] .b-cal-event-bar-container`); // We've dragged it cross-resource into the all day section

    await t.waitFor(() => checkIn.resourceId === 'bryntum');
    t.is(checkIn.resourceId, 'bryntum');
    t.ok(checkIn.allDay); // Starts off right

    t.is(excursion.resourceId, 'mats');
    t.selectorNotExists(`#${bryntumView.id} [data-event-id="18"]`);
    t.selectorExists(`#${matsView.id} [data-event-id="18"]`); // drag "Excursion" across to be for the Bryntum Team

    await t.dragBy('[data-event-id="18"]', [-bryntumView.element.offsetWidth * 2, 0]); // We've dragged it cross-resource into Bryntum Team section

    await t.waitFor(() => excursion.resourceId === 'bryntum');
    t.is(excursion.resourceId, 'bryntum');
    await t.waitForSelector(`#${bryntumView.id} [data-event-id="18"]`);
    await t.waitForSelectorNotFound(`#${matsView.id} [data-event-id="18"]`); // Deselect the Bryntum resource

    await t.click('[data-ref="resourceFilter"] [data-id="bryntum"]'); // Bryntum team view must disappear

    await t.waitFor(() => resourceView.items.length === itemCount - 1); // Select the Bryntum resource

    await t.click('[data-ref="resourceFilter"] [data-id="bryntum"]'); // Bryntum team view must disappear

    await t.waitFor(() => resourceView.items.length === itemCount); // Use editor to move Excursion back to Mats

    await t.doubleClick('[data-event-id="18"]'); // Wait for editor to appear and gain focus.

    await t.waitFor(() => {
      var _calendar$features$ev;

      return (_calendar$features$ev = calendar.features.eventEdit.editor) === null || _calendar$features$ev === void 0 ? void 0 : _calendar$features$ev.containsFocus;
    });
    const {
      resourceField,
      saveButton
    } = calendar.features.eventEdit.editor.widgetMap;
    await t.click(resourceField.triggers.expand.element);
    await t.click('.b-resourcecombo-picker .b-list-item[data-id="mats"]');
    await t.click(saveButton.element); // Edited back to old resource

    t.is(excursion.resourceId, 'mats');
    await t.waitForSelectorNotFound(`#${bryntumView.id} [data-event-id="18"]`);
    await t.waitForSelector(`#${matsView.id} [data-event-id="18"]`);
    await t.click(`#${matsView.id} [data-event-id="18"]`); // EventTooltip feature must work

    await t.waitFor(() => calendar.features.eventTooltip.tooltip.isVisible);
    calendar.features.eventTooltip.tooltip.hide(); // Test drag-create creating the event with the correct resource

    await t.dragBy(`#${matsView.id} .b-dayview-day-detail.b-calendar-cell[data-date="2019-10-16"]`, [16, hourHeight * 2], null, null, null, null, [16, hourHeight]); // Wait for editor to appear and gain focus.

    await t.waitFor(() => {
      var _calendar$features$ev2;

      return (_calendar$features$ev2 = calendar.features.eventEdit.editor) === null || _calendar$features$ev2 === void 0 ? void 0 : _calendar$features$ev2.containsFocus;
    });
    t.is(calendar.features.eventEdit.editor.widgetMap.resourceField.value, 'mats', 'View\'s calendar correctly applied');
    await t.type(document.activeElement, '[ESCAPE]');
    t.notOk(calendar.features.eventEdit.editor.isVisible, 'Event editor hidden'); // Test dblclick creating the event with the correct resource

    await t.doubleClick(`#${matsView.id} .b-dayview-day-detail.b-calendar-cell[data-date="2019-10-16"]`, null, null, null, [16, hourHeight]); // Wait for editor to appear and gain focus.

    await t.waitFor(() => {
      var _calendar$features$ev3;

      return (_calendar$features$ev3 = calendar.features.eventEdit.editor) === null || _calendar$features$ev3 === void 0 ? void 0 : _calendar$features$ev3.containsFocus;
    });
    t.is(calendar.features.eventEdit.editor.widgetMap.resourceField.value, 'mats', 'View\'s calendar correctly applied'); // Switch to month resources

    t.click(calendar.tbar.widgetMap.monthResourcesShowButton.element); // Wait for it to be visible

    t.waitForElementVisible(calendar.viewContainer.widgetMap.monthResources.element);
  });
  t.it('With async loaded data', async t => {
    t.mockUrl('resourceview-test', {
      delay: 100,
      responseText: JSON.stringify(t.getHackathonData())
    });
    calendar = await getCalendar({
      date: new Date(2019, 9, 14),
      crudManager: {
        transport: {
          load: {
            url: 'resourceview-test'
          }
        },
        autoLoad: true,
        autoSync: false
      },
      modes: {
        day: null,
        week: null,
        month: null,
        year: null,
        agenda: null,
        weekResources: {
          type: 'resourceView',
          title: 'Week resources',
          view: {
            minWidth: '16em',
            hideNonWorkingDays: true,
            dayStartTime: 8
          }
        },
        monthResources: {
          type: 'resourceView',
          title: 'Month resources',
          view: {
            type: 'monthview',
            minWidth: '16em',
            hideNonWorkingDays: true
          }
        }
      }
    });
    await t.waitForProjectReady(calendar); // Renders async

    await t.waitFor(() => calendar.modes.weekResources.items[0]);
    const resourceView = calendar.activeView,
          bryntumView = resourceView.items[1],
          matsView = resourceView.items[3],
          checkIn = calendar.eventStore.getById(2),
          excursion = calendar.eventStore.getById(18),
          itemCount = resourceView.items.length,
          {
      hourHeight
    } = calendar.modes.weekResources.items[0]; // WeekViews have one extra item as the time axis, and another trailing one as the
    // scrollbar *if there are visible scrollbars*.

    t.is(itemCount, calendar.resourceStore.count + 1 + (DomHelper.scrollBarWidth ? 1 : 0)); // Start resource correct, and it's not an all day event

    t.is(checkIn.resourceId, 'hotel');
    t.notOk(checkIn.allDay); // drag "Check In" across to be an all day event for the Bryntum Team

    await t.dragTo('[data-event-id="2"]', `#${bryntumView.id} .b-dayview-allday.b-calendar-cell[data-date="2019-10-17"] .b-cal-event-bar-container`); // We've dragged it cross-resource into the all day section

    await t.waitFor(() => checkIn.resourceId === 'bryntum');
    t.is(checkIn.resourceId, 'bryntum');
    t.ok(checkIn.allDay); // Starts off right

    t.is(excursion.resourceId, 'mats');
    t.selectorNotExists(`#${bryntumView.id} [data-event-id="18"]`);
    t.selectorExists(`#${matsView.id} [data-event-id="18"]`); // drag "Excursion" across to be for the Bryntum Team

    await t.dragBy('[data-event-id="18"]', [-bryntumView.element.offsetWidth * 2, 0]); // We've dragged it cross-resource into Bryntum Team section

    await t.waitFor(() => excursion.resourceId === 'bryntum');
    t.is(excursion.resourceId, 'bryntum');
    await t.waitForSelector(`#${bryntumView.id} [data-event-id="18"]`);
    await t.waitForSelectorNotFound(`#${matsView.id} [data-event-id="18"]`); // Deselect the Bryntum resource

    await t.click('[data-ref="resourceFilter"] [data-id="bryntum"]'); // Bryntum team view must disappear

    await t.waitFor(() => resourceView.items.length === itemCount - 1); // Select the Bryntum resource

    await t.click('[data-ref="resourceFilter"] [data-id="bryntum"]'); // Bryntum team view must disappear

    await t.waitFor(() => resourceView.items.length === itemCount); // Use editor to move Excursion back to Mats

    await t.doubleClick('[data-event-id="18"]'); // Wait for editor to appear and gain focus.

    await t.waitFor(() => {
      var _calendar$features$ev4;

      return (_calendar$features$ev4 = calendar.features.eventEdit.editor) === null || _calendar$features$ev4 === void 0 ? void 0 : _calendar$features$ev4.containsFocus;
    });
    const {
      resourceField,
      saveButton
    } = calendar.features.eventEdit.editor.widgetMap;
    await t.click(resourceField.triggers.expand.element);
    await t.click('.b-resourcecombo-picker .b-list-item[data-id="mats"]');
    await t.click(saveButton.element); // Edited back to old resource

    t.is(excursion.resourceId, 'mats');
    await t.waitForSelectorNotFound(`#${bryntumView.id} [data-event-id="18"]`);
    await t.waitForSelector(`#${matsView.id} [data-event-id="18"]`);
    await t.click(`#${matsView.id} [data-event-id="18"]`); // EventTooltip feature must work

    await t.waitFor(() => calendar.features.eventTooltip.tooltip.isVisible);
    calendar.features.eventTooltip.tooltip.hide(); // Test drag-create creating the event with the correct resource

    await t.dragBy(`#${matsView.id} .b-dayview-day-detail.b-calendar-cell[data-date="2019-10-16"]`, [16, hourHeight * 2], null, null, null, null, [16, hourHeight]); // Wait for editor to appear and gain focus.

    await t.waitFor(() => {
      var _calendar$features$ev5;

      return (_calendar$features$ev5 = calendar.features.eventEdit.editor) === null || _calendar$features$ev5 === void 0 ? void 0 : _calendar$features$ev5.containsFocus;
    });
    t.is(calendar.features.eventEdit.editor.widgetMap.resourceField.value, 'mats', 'View\'s calendar correctly applied');
    await t.type(document.activeElement, '[ESCAPE]');
    t.notOk(calendar.features.eventEdit.editor.isVisible, 'Event editor hidden'); // Test dblclick creating the event with the correct resource

    await t.doubleClick(`#${matsView.id} .b-dayview-day-detail.b-calendar-cell[data-date="2019-10-16"]`, null, null, null, [16, hourHeight]); // Wait for editor to appear and gain focus.

    await t.waitFor(() => {
      var _calendar$features$ev6;

      return (_calendar$features$ev6 = calendar.features.eventEdit.editor) === null || _calendar$features$ev6 === void 0 ? void 0 : _calendar$features$ev6.containsFocus;
    });
    t.is(calendar.features.eventEdit.editor.widgetMap.resourceField.value, 'mats', 'View\'s calendar correctly applied'); // Switch to month resources

    t.click(calendar.tbar.widgetMap.monthResourcesShowButton.element); // Wait for it to be visible

    t.waitForElementVisible(calendar.viewContainer.widgetMap.monthResources.element);
  });
});