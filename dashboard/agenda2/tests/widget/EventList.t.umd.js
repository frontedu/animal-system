"use strict";

StartTest(t => {
  let calendar;
  t.beforeEach(() => {
    var _calendar;

    (_calendar = calendar) === null || _calendar === void 0 ? void 0 : _calendar.destroy();
  }); // https://github.com/bryntum/support/issues/2834

  t.it('Should use icons defined with b-icon', async t => {
    calendar = await t.getCalendar({
      modes: {
        list: true
      },
      mode: 'list'
    });
    t.chain({
      waitForSelector: '.b-eventlist'
    }, {
      rightClick: '.b-grid-header[data-column="name"]'
    }, {
      waitForElementVisible: '.b-icon-calendar-week',
      desc: 'b-icon applied'
    }, () => t.elementIsVisible('.b-icon-calendar-week', 'Icon calendar is visible'));
  });
  t.it('Key events should be handled only once', async t => {
    const startDate = DateHelper.clearTime(new Date());
    calendar = await t.getCalendar({
      eventStore: {
        data: [{
          name: 'Test',
          startDate,
          endDate: DateHelper.add(startDate, 1, 'day')
        }]
      },
      modes: {
        list: true
      },
      mode: 'list'
    });
    let keydownCounter = 0;
    t.spyOn(calendar.modes.list, 'handleEvent').and.callFake(e => {
      if (e.type === 'keydown') {
        if (++keydownCounter > 1) {
          t.fail('Multiple keydown events delivered to ListView');
        }
      }
    });
    await t.click('.b-grid-cell'); // This should only end up in handleEvent once (for each component event - keydown, keyup, keypress)

    await t.keyPress(document.activeElement, '[ENTER]');
  });
  t.describe('Snapping to range start', t => {
    function validateListRange() {
      let passes = false,
          failingEvent;
      calendar.activeView.store.forEach(e => {
        for (let d = e.startDate; !passes && d < e.endDate; d.setDate(d.getDate() + 1)) {
          // The event's date must intersect with the view's range
          passes = DateHelper.intersectSpans(e.startDate, e.endDate, calendar.activeView.startDate, calendar.activeView.endDate);

          if (!passes) {
            failingEvent = e;
          }
        }
      });

      if (!passes) {
        t.fail(`Event ${failingEvent.name} not coinciding with EventList's range found`);
      }

      calendar.eventStore.forEach(e => {
        if (!calendar.activeView.store.includes(e)) {
          for (let d = e.startDate; !passes && d < e.endDate; d.setDate(d.getDate() + 1)) {
            // The event's date must *NOT* intersect with the view's range
            passes = !DateHelper.intersectSpans(e.startDate, e.endDate, calendar.activeView.startDate, calendar.activeView.endDate);

            if (!passes) {
              failingEvent = e;
            }
          }
        }
      });

      if (!passes) {
        t.fail(`Event ${failingEvent.name} coinciding with EventList's range found`);
      }
    }

    t.it('View\'s events must intersect the view\'s range', async t => {
      const eventStore = new EventStore({
        data: t.getHackathonData().events.rows
      }); // eslint-disable-next-line no-undef

      const resourceStore = new ResourceStore({
        data: t.getHackathonData().resources.rows
      });
      calendar = await t.getCalendar({
        date: '2019-10-16',
        eventStore,
        resourceStore,
        modes: {
          day: null,
          week: null,
          month: null,
          year: null,
          agenda: null,
          list: {
            range: '1w'
          }
        },
        mode: 'list'
      });
      validateListRange(); // must have snapped to range start

      t.is(calendar.activeView.startDate, new Date(2019, 9, 13));
      t.is(calendar.activeView.endDate, new Date(2019, 9, 20));
      await t.click(calendar.widgetMap.nextButton.element);
      validateListRange(); // must have snapped to range start

      t.is(calendar.activeView.startDate, new Date(2019, 9, 20));
      t.is(calendar.activeView.endDate, new Date(2019, 9, 27));
      await t.click('[data-ref="datePicker"] .b-calendar-cell[data-date="2019-10-16"]'); // must have snapped to range start

      t.is(calendar.activeView.startDate, new Date(2019, 9, 13));
      t.is(calendar.activeView.endDate, new Date(2019, 9, 20));
      calendar.activeView.range = '3d';
      t.is(calendar.activeView.startDate, new Date(2019, 9, 16));
      t.is(calendar.activeView.endDate, new Date(2019, 9, 19));
      await t.click('[data-ref="datePicker"] .b-calendar-cell[data-date="2019-10-17"]'); // Using the selected date as the start

      t.is(calendar.activeView.startDate, new Date(2019, 9, 17));
      t.is(calendar.activeView.endDate, new Date(2019, 9, 20));
      calendar.activeView.range = '1 decade'; // must have snapped to decade which is the 2010s

      t.is(calendar.activeView.startDate, new Date(2010, 0, 1));
      t.is(calendar.activeView.endDate, new Date(2020, 0, 1));
      await t.click(calendar.widgetMap.prevButton.element); // must have snapped to decade which is the 2000s

      t.is(calendar.activeView.startDate, new Date(2000, 0, 1));
      t.is(calendar.activeView.endDate, new Date(2010, 0, 1));
    });
  });
  t.it('columns should override where field matches', async t => {
    calendar = await t.getCalendar({
      modes: {
        list: {
          columns: [{
            field: 'name',
            text: 'Test 1'
          }, {
            field: 'startDate',
            text: 'Test 2'
          }, {
            field: 'endDate',
            text: 'Test 3'
          }]
        }
      },
      mode: 'list'
    }); // Check that configured columns override the default

    t.selectorExists('.b-grid-header[data-column="name"]:contains(Test 1)');
    t.selectorExists('.b-grid-header[data-column="startDate"]:contains(Test 2)');
    t.selectorExists('.b-grid-header[data-column="endDate"]:contains(Test 3)');
  });
});