import { EventStore, ResourceStore, DomHelper, DateHelper } from '../../build/calendar.module.js?459414';

StartTest(t => {
    let calendar, eventStore, resourceStore, harness, agenda, year, month, week, day;

    async function getCalendar(config) {
        const calendar = await t.getCalendar(config);
        eventStore = calendar.eventStore;
        resourceStore = calendar.resourceStore;

        // eslint-disable-next-line no-unused-vars
        ({ agenda, year, month, week, day } = calendar.modes);

        return calendar;
    }

    t.beforeEach(function() {

        // Set doc styling to default values
        document.body.style.paddingTop = 0;
        document.scrollingElement.scrollTop = 0;

        if (calendar && !calendar.isDestroyed) {
            const eventEls = calendar.element.querySelectorAll('.b-calendar-cell.b-dayview-day-detail .b-cal-event-wrap');

            // Check that no events ever get placed outside the visible bounds
            // https://github.com/bryntum/support/issues/3585
            for (let i = 0, { length } = eventEls; i < length; i++) {
                if (parseFloat(eventEls[i].style.top) > 100) {
                    t.fail(`Event ${eventEls[i].dataset.eventId} element is rendered out of bounds`);
                }
            }
        }
        harness = harness?.destroy();
        calendar?.destroy();

        // Check that none of the floating things are persisting
        if (t.query('.b-overflowpopup,.b-sch-event-tooltip.b-eventeditor').length > 0) {
            t.selectorNotExists('.b-overflowpopup:visible');
            t.selectorNotExists('.b-sch-event-tooltip');
            t.selectorNotExists('.b-eventeditor');
        }
    });

    // https://github.com/bryntum/support/issues/4005
    t.it('Event bar colours should come from resource\'s eventColor', async t => {
        eventStore = new EventStore({
            // Add a recurring meeting
            data : t.getHackathonData().events.rows.concat([{
                duration       : 1,
                durationUnit   : 'hour',
                id             : 'twice-weekly',
                name           : 'Recurring Meeting',
                recurrenceRule : 'FREQ=WEEKLY;BYDAY=TU,TH',
                startDate      : new Date(2019, 9, 15, 13)
            }])
        });

        resourceStore = new ResourceStore({
            data : t.getHackathonData().resources.rows
        });

        calendar = await getCalendar({
            date  : new Date(2019, 9, 14),
            eventStore,
            resourceStore,
            modes : {
                day  : null,
                week : null,
                year : null
            }
        });

        const checkEvents = function(v) {
            v.element.querySelectorAll('[data-event-id="1"] .b-cal-event').forEach(e => {
                t.hasStyle(e, 'background-color', 'rgb(36, 159, 188)');
            });
            v.element.querySelectorAll('[data-event-id="3"] .b-cal-event').forEach(e => {
                t.hasStyle(e, 'background-color', 'rgb(228, 73, 89)');
            });
        };

        // Check that event bars are the correct colour
        checkEvents(calendar.activeView);

        calendar.mode = 'agenda';

        await t.waitForAnimations();

        // Check that event bars are the correct colour
        checkEvents(calendar.activeView);
    });

    t.it('sanity', async t => {
        eventStore = new EventStore({
            // Add a recurring meeting
            data : t.getHackathonData().events.rows.concat([{
                duration       : 1,
                durationUnit   : 'hour',
                id             : 'twice-weekly',
                name           : 'Recurring Meeting',
                recurrenceRule : 'FREQ=WEEKLY;BYDAY=TU,TH',
                startDate      : new Date(2019, 9, 15, 13)
            }])
        });

        resourceStore = new ResourceStore({
            data : t.getHackathonData().resources.rows
        });

        calendar = await getCalendar({
            date         : new Date(2019, 9, 14),
            eventStore,
            resourceStore,
            mode         : 'month',
            modeDefaults : {
                eventRenderer : function({ eventRecord, renderData }) {
                    // highlight all events which are related to conferences
                    if (eventRecord.name.indexOf('conference') !== -1) {
                        renderData.style.textDecoration = 'underline';
                        renderData.cls['conference-event'] = true;
                    }
                }
            }
        });

        // Only the recurring events within the range of real data are visible
        t.selectorCountIs('.b-cal-event-body:contains(Recurring Meeting)', 6);

        t.selectorCountIs('.b-cal-event-wrap.b-allday.b-continues-right:not(.b-overflow):not(.b-continues-left)', 1, 'Hackathon start el found');
        t.selectorCountIs('.b-cal-event-wrap.b-allday.b-continues-left:not(.b-overflow):not(.b-continues-right)', 1, 'Hackathon end el found');

        const conferenceEls = t.query('.b-cal-event-body:contains(conference)');

        // Check renderer has worked
        conferenceEls.forEach(el => {
            t.is(DomHelper.getStyleValue(el, 'text-decoration'), 'underline');
        });
    });

    t.it('modeDefaults', async t => {
        eventStore = new EventStore({
            data : t.getHackathonData().events.rows
        });

        resourceStore = new ResourceStore({
            data : t.getHackathonData().resources.rows
        });

        calendar = await getCalendar({
            date         : new Date(2019, 9, 14),
            eventStore,
            resourceStore,
            mode         : 'month',
            modeDefaults : {
                hideNonWorkingDays : true
            }
        });

        // Only work days are visible
        t.selectorCountIs('.b-monthview .b-calendar-day-header:visible', 5);

        calendar.mode = 'week';

        // Only work days are visible
        await t.waitForAnimations();

        t.selectorCountIs('.b-weekview .b-cal-cell-header:visible', 5);

        calendar.modeDefaults.hideNonWorkingDays = false;

        // All days now visible
        t.selectorCountIs('.b-weekview .b-cal-cell-header:visible', 7);

        calendar.mode = 'month';

        await t.waitForAnimations();

        // All days now visible
        t.selectorCountIs('.b-monthview .b-calendar-day-header:visible', 7);
    });

    t.it('modeDefaults not reapplying initial defaults', async t => {
        eventStore = new EventStore({
            data : t.getHackathonData().events.rows
        });

        resourceStore = new ResourceStore({
            data : t.getHackathonData().resources.rows
        });

        calendar = await getCalendar({
            sidebar      : false,
            date         : new Date(2019, 9, 14),
            eventStore,
            resourceStore,
            mode         : 'month',
            modeDefaults : {
                hideNonWorkingDays : true
            }
        });

        // Only work days are visible
        t.selectorCountIs('.b-monthview .b-calendar-day-header:visible', 5);

        // Update only the month view to show non working days
        calendar.activeView.hideNonWorkingDays = false;

        await t.waitFor(() => t.query('.b-monthview .b-calendar-day-header:visible').length === 7);

        // This should just update the minDayWidth of modes which understand.
        // It should *not* reapply initial modeDefaults to child views.
        calendar.modeDefaults.minDayWidth = 200;

        // All days still visible. The setting of minDayWidth in modeDefaults
        // should not have reapplied the initial default of hideNonWorkingDays : true.
        t.selectorCountIs('.b-monthview .b-calendar-day-header:visible', 7);

        calendar.mode = 'week';

        await t.waitForAnimations();

        // Setting was applied to the week. Five days of width 200
        t.isDeeply(t.query('.b-weekview .b-cal-cell-header:visible').map(d => d.offsetWidth), [
            200,
            200,
            200,
            200,
            200
        ]);
    });

    t.it('Datepicker with events', async t => {
        eventStore = new EventStore({
            // Add a recurring meeting
            data : t.getHackathonData().events.rows.concat([{
                duration       : 1,
                durationUnit   : 'hour',
                id             : 'twice-weekly',
                name           : 'Recurring Meeting',
                recurrenceRule : 'FREQ=WEEKLY;BYDAY=TU,TH',
                startDate      : new Date(2019, 9, 15, 13)
            }])
        });

        resourceStore = new ResourceStore({
            data : t.getHackathonData().resources.rows
        });

        calendar = await getCalendar({
            date       : new Date(2019, 9, 14),
            eventStore,
            resourceStore,
            mode       : 'month',
            // Show event presence as bullets in the date picker cells
            datePicker : {
                events : true
            }
        });

        const c = t.query('.b-sidebar .b-calendar-cell[data-date="2019-10-15"]')[0];

        // Cells with bullets are expanded
        t.notOk(c.scrollHeight > c.clientHeight);
    });

    t.it('datePicker', async t => {
        eventStore = new EventStore({
            data : t.getHackathonData().events.rows
        });

        resourceStore = new ResourceStore({
            data : t.getHackathonData().resources.rows
        });

        calendar = await getCalendar({
            date       : new Date(2019, 9, 14),
            eventStore,
            resourceStore,
            datePicker : {
                events : 'count'
            },
            mode         : 'month',
            modeDefaults : {
                eventRenderer : function({ eventRecord, renderData }) {
                    // highlight all events which are related to conferences
                    if (eventRecord.name.indexOf('conference') !== -1) {
                        renderData.style.textDecoration = 'underline';
                        renderData.cls['conference-event'] = true;
                    }
                }
            }
        });

        // Badges all correct
        t.selectorCountIs('.b-calendar-cell .b-cell-events-badge', 8);
        t.selectorCountIs('.b-calendar-cell[data-date="2019-10-14"] .b-cell-events-badge:contains(4)', 1);
        t.selectorCountIs('.b-calendar-cell[data-date="2019-10-15"] .b-cell-events-badge:contains(7)', 1);
        t.selectorCountIs('.b-calendar-cell[data-date="2019-10-16"] .b-cell-events-badge:contains(7)', 1);
        t.selectorCountIs('.b-calendar-cell[data-date="2019-10-17"] .b-cell-events-badge:contains(4)', 1);
        t.selectorCountIs('.b-calendar-cell[data-date="2019-10-18"] .b-cell-events-badge:contains(5)', 1);
        t.selectorCountIs('.b-calendar-cell[data-date="2019-10-19"] .b-cell-events-badge:contains(5)', 1);
        t.selectorCountIs('.b-calendar-cell[data-date="2019-10-20"] .b-cell-events-badge:contains(5)', 1);
        t.selectorCountIs('.b-calendar-cell[data-date="2019-10-21"] .b-cell-events-badge:contains(2)', 1);

        eventStore.remove(1);

        // Wait for next refresh of DatePicker
        await t.waitForSelector('.b-calendar-cell[data-date="2019-10-14"] .b-cell-events-badge:contains(3)');

        // Badges update
        t.selectorCountIs('.b-calendar-cell .b-cell-events-badge', 8);
        t.selectorCountIs('.b-calendar-cell[data-date="2019-10-14"] .b-cell-events-badge:contains(3)', 1);
        t.selectorCountIs('.b-calendar-cell[data-date="2019-10-15"] .b-cell-events-badge:contains(6)', 1);
        t.selectorCountIs('.b-calendar-cell[data-date="2019-10-16"] .b-cell-events-badge:contains(6)', 1);
        t.selectorCountIs('.b-calendar-cell[data-date="2019-10-17"] .b-cell-events-badge:contains(3)', 1);
        t.selectorCountIs('.b-calendar-cell[data-date="2019-10-18"] .b-cell-events-badge:contains(4)', 1);
        t.selectorCountIs('.b-calendar-cell[data-date="2019-10-19"] .b-cell-events-badge:contains(4)', 1);
        t.selectorCountIs('.b-calendar-cell[data-date="2019-10-20"] .b-cell-events-badge:contains(4)', 1);
        t.selectorCountIs('.b-calendar-cell[data-date="2019-10-21"] .b-cell-events-badge:contains(1)', 1);
    });

    t.it('datePicker events property and filtering', async t => {
        eventStore = new EventStore({
            data : t.getHackathonData().events.rows
        });

        resourceStore = new ResourceStore({
            data : t.getHackathonData().resources.rows
        });

        calendar = await getCalendar({
            date         : new Date(2019, 9, 14),
            eventStore,
            resourceStore,
            mode         : 'month',
            modeDefaults : {
                eventRenderer : function({ eventRecord, renderData }) {
                    // highlight all events which are related to conferences
                    if (eventRecord.name.indexOf('conference') !== -1) {
                        renderData.style.textDecoration = 'underline';
                        renderData.cls['conference-event'] = true;
                    }
                }
            }
        });

        t.selectorCountIs('.b-calendar-cell .b-cell-events-badge', 0);

        calendar.datePicker.events = 'count';

        // Wait for next refresh of DatePicker
        await t.waitFor(() => t.query('.b-calendar-cell .b-cell-events-badge').length === 8);

        // Badges all correct
        t.selectorCountIs('.b-calendar-cell[data-date="2019-10-14"] .b-cell-events-badge:contains(4)', 1);
        t.selectorCountIs('.b-calendar-cell[data-date="2019-10-15"] .b-cell-events-badge:contains(7)', 1);
        t.selectorCountIs('.b-calendar-cell[data-date="2019-10-16"] .b-cell-events-badge:contains(7)', 1);
        t.selectorCountIs('.b-calendar-cell[data-date="2019-10-17"] .b-cell-events-badge:contains(4)', 1);
        t.selectorCountIs('.b-calendar-cell[data-date="2019-10-18"] .b-cell-events-badge:contains(5)', 1);
        t.selectorCountIs('.b-calendar-cell[data-date="2019-10-19"] .b-cell-events-badge:contains(5)', 1);
        t.selectorCountIs('.b-calendar-cell[data-date="2019-10-20"] .b-cell-events-badge:contains(5)', 1);
        t.selectorCountIs('.b-calendar-cell[data-date="2019-10-21"] .b-cell-events-badge:contains(2)', 1);

        await t.click(calendar.widgetMap.eventFilter.input);
        await t.type(null, 'Review');

        // Wait for next refresh of DatePicker
        await t.waitFor(() => t.query('.b-calendar-cell .b-cell-events-badge').length === 3);

        // Badges update
        t.selectorCountIs('.b-calendar-cell[data-date="2019-10-15"] .b-cell-events-badge:contains(2)', 1);
        t.selectorCountIs('.b-calendar-cell[data-date="2019-10-16"] .b-cell-events-badge:contains(1)', 1);
        t.selectorCountIs('.b-calendar-cell[data-date="2019-10-18"] .b-cell-events-badge:contains(1)', 1);
    });

    t.it('should align overflow popup correctly in a scrolled page', async t => {
        eventStore = new EventStore({
            data : [{
                startDate : '2019-10-15',
                endDate   : '2019-10-16',
                name      : 'Event 1'
            }, {
                startDate : '2019-10-15',
                endDate   : '2019-10-16',
                name      : 'Event 2'
            }, {
                startDate : '2019-10-15',
                endDate   : '2019-10-16',
                name      : 'Event 3'
            }, {
                startDate : '2019-10-15',
                endDate   : '2019-10-16',
                name      : 'Event 4'
            }, {
                startDate : '2019-10-15',
                endDate   : '2019-10-16',
                name      : 'Event 5'
            }, {
                startDate : '2019-10-15',
                endDate   : '2019-10-16',
                name      : 'Event 6'
            }, {
                startDate : '2019-10-15',
                endDate   : '2019-10-16',
                name      : 'Event 7'
            }, {
                startDate : '2019-10-15',
                endDate   : '2019-10-16',
                name      : 'Event 8'
            }, {
                startDate : '2019-10-15',
                endDate   : '2019-10-16',
                name      : 'Event 9'
            }, {
                startDate : '2019-10-15',
                endDate   : '2019-10-16',
                name      : 'Event 10'
            }]
        });

        resourceStore = new ResourceStore({
            data : []
        });

        calendar = await getCalendar({
            width   : DomHelper.scrollBarWidth ? '100%' : 'calc(100% - 15px)', // Keep width standard regardless of platform scrollbars
            date    : new Date(2019, 9, 14),
            sidebar : false,
            eventStore,
            resourceStore,
            modes   : {
                day    : false,
                agenda : false
            }
        });

        /**
         * Sorry about the "magic numbers" in the test. But any algorithmic
         * calculation of correct results would be as susceptible to bugs
         * as the code it is checking, so the numbers were ascertained by
         * observing that visual behaviour is correct.
         */
        await t.click('.b-weekview .b-cal-cell-overflow');
        await t.waitForSelector('.b-overflowpopup:visible');

        let xy = DomHelper.getTranslateXY(calendar.activeView.overflowPopup.element);
        t.isApproxPx(xy[0], 305, 10);
        t.isApproxPx(xy[1], 240, 10);

        // Anchor correctly colour matched
        const c = DomHelper.getStyleValue(calendar.activeView.overflowPopup.headerElement, 'backgroundColor');
        t.hasStyle(calendar.activeView.overflowPopup.anchorPathElement, 'fill', c);

        await t.click('[data-ref="monthShowButton"]');

        await t.waitForAnimations();

        await t.click('.b-monthview .b-cal-cell-overflow');
        await t.waitForSelector('.b-overflowpopup:visible');

        xy = DomHelper.getTranslateXY(calendar.activeView.overflowPopup.element);
        t.isApproxPx(xy[0], 270, 10);
        t.isApproxPx(xy[1], 440, 10);

        await t.click('[data-ref="yearShowButton"]');

        await t.waitForAnimations();

        await t.click('.b-yearview .b-cal-cell-overflow');
        await t.waitForSelector('.b-overflowpopup:visible');

        xy = DomHelper.getTranslateXY(calendar.activeView.overflowPopup.element);
        t.isApproxPx(xy[0], 270, 10);
        t.isApproxPx(xy[1], 345, 10);
        document.body.style.paddingTop = '';
    });

    t.it('Drilling down', async t => {
        t.mockUrl('test-drilldown-data', {
            delay        : 100,
            responseText : JSON.stringify({
                success   : true,
                resources : {
                    rows : t.getHackathonData().resources.rows
                },
                events : {
                    rows : t.getHackathonData().events.rows
                }
            })
        });

        calendar = await getCalendar({
            crudManager : {
                transport : {
                    load : {
                        url : 'test-drilldown-data'
                    }
                },
                autoLoad : true,
                autoSync : false
            },
            date : new Date(2019, 9, 13)
        });

        let overflowpopupShowCount = 0;

        t.chain(
            { diag : 'Asserting prev/next buttons tooltip locales' },

            { moveCursorTo : '[data-ref="prevButton"]', desc : 'Mouse over Previous button' },
            { waitForElementVisible : '.b-tooltip :contains(Previous week)' },
            { moveCursorTo : '[data-ref="nextButton"]', desc : 'Mouse over Next button' },
            { waitForElementVisible : '.b-tooltip :contains(Next week)' },

            // Move the views that we are going to be drilling to to
            // date ranges that would be *incorrect* if we saw them.
            { click : 'button[data-ref="prevButton"]' },

            { click : 'button[data-ref="prevButton"]' },

            { click : 'button:contains(Month)' },

            async() => t.is(calendar.mode, 'month'),

            { diag : 'Asserting prev/next buttons tooltip locales' },

            { moveCursorTo : '[data-ref="prevButton"]', desc : 'Mouse over Previous button' },
            { waitForElementVisible : '.b-tooltip :contains(Previous month)' },
            { moveCursorTo : '[data-ref="nextButton"]', desc : 'Mouse over Next button' },
            { waitForElementVisible : '.b-tooltip :contains(Next month)' },

            { click : 'button[data-ref="nextButton"]' },

            { click : 'button[data-ref="nextButton"]' },

            { click : 'button:contains(Year)' },

            async() => t.is(calendar.mode, 'year'),

            { diag : 'Asserting prev/next buttons tooltip locales' },

            { moveCursorTo : '[data-ref="prevButton"]', desc : 'Mouse over Previous button' },
            { waitForElementVisible : '.b-tooltip :contains(Previous year)' },
            { moveCursorTo : '[data-ref="nextButton"]', desc : 'Mouse over Next button' },
            { waitForElementVisible : '.b-tooltip :contains(Next year)' },

            async() => t.is(calendar.mode, 'year'),

            next => {
                calendar.modes.year.scrollable.scrollBy(0, 300);
                next();
            },

            { click : '.b-yearview-month-name:contains(October)', offset : [30, '50%'] },

            async() => t.is(calendar.mode, 'month'),

            next => {
                t.is(calendar.modes.month.month.month, 9, 'Navigated to October');
                next();
            },

            { click : '.b-week-num:contains(42)' },

            async() => t.is(calendar.mode, 'week'),

            next => {
                t.isDeeply(calendar.modes.week.week, [2019, 42], 'Navigated to week 42');
                next();
            },

            { click : '.b-day-name-date:contains(17)' },

            async() => t.is(calendar.mode, 'day'),

            next => {
                t.isDeeply(DateHelper.format(calendar.modes.day.date, 'YYYY-MM-DD'), '2019-10-17', 'Navigated October 17th');
                next();
            },

            { diag : 'Asserting prev/next buttons tooltip locales' },

            { moveCursorTo : '[data-ref="prevButton"]', desc : 'Mouse over Previous button' },
            { waitForElementVisible : '.b-tooltip :contains(Previous day)' },
            { moveCursorTo : '[data-ref="nextButton"]', desc : 'Mouse over Next button' },
            { waitForElementVisible : '.b-tooltip :contains(Next day)' },

            // Now we test drilling from year to week
            { click : 'button:contains(Week)' },

            async() => t.is(calendar.mode, 'week'),

            // Move the WeekView that we are going to be drilling to to
            // a date range that would be *incorrect* if we saw it.
            { click : 'button[data-ref="prevButton"]' },

            { click : 'button[data-ref="prevButton"]' },

            { click : 'button:contains(Year)' },

            async() => t.is(calendar.mode, 'year'),

            // The dblclick we do to drill must not trigger the overflow popup
            next => {
                calendar.modes.year.on({
                    showoverflowpopup() {
                        overflowpopupShowCount++;
                    }
                });
                next();
            },

            // Dblclick on a year cell should go to the week
            { dblclick : '.b-yearview-month .b-calendar-cell[data-date="2019-10-17"]' },

            async() => {
                t.is(calendar.mode, 'week');
                t.is(overflowpopupShowCount, 0, 'YearView popup has not been shown');
                t.isDeeply(DateHelper.format(calendar.modes.week.date, 'YYYY-MM-DD'), '2019-10-17', 'Navigated October 17th');
            },

            // AGAIN, but this time, showing the overflow popup before drilling
            // Now we test drilling from year to week
            // Move the WeekView that we are going to be drilling to to
            // a date range that would be *incorrect* if we saw it.
            { click : 'button[data-ref="prevButton"]' },

            { click : 'button[data-ref="prevButton"]' },

            { click : 'button:contains(Year)' },

            async() => t.is(calendar.mode, 'year'),

            // Single click on a year cell should show the overflow popup
            {
                waitForEvent : [calendar.modes.year, 'showoverflowpopup'],
                trigger      : { click : '.b-yearview-month .b-calendar-cell[data-date="2019-10-17"]' }
            },

            // Dblclick on the same cell should go to the week AND hide the overflow popup
            { dblclick : '.b-yearview-month .b-calendar-cell[data-date="2019-10-17"]' },

            async() => {
                t.notOk(calendar.modes.year.overflowPopup.isVisible, 'YearView overflow popup has hidden');

                t.is(overflowpopupShowCount, 1, 'YearView overflow popup showed once');
                t.is(calendar.mode, 'week');
            },

            () => {
                t.isDeeply(DateHelper.format(calendar.modes.week.date, 'YYYY-MM-DD'), '2019-10-17', 'Navigated October 17th');
            }
        );
    });

    t.it('Should default to current date if no date provided', async t => {
        calendar = await getCalendar({
            mode : 'day'
        });

        t.is(calendar.date, DateHelper.clearTime(new Date()));
    });

    t.it('Overflow popup should hide when its owner hides', async t => {
        eventStore = new EventStore({
            // Add a recurring meeting
            data : t.getHackathonData().events.rows.concat([{
                duration       : 1,
                durationUnit   : 'hour',
                id             : 'twice-weekly',
                name           : 'Recurring Meeting',
                recurrenceRule : 'FREQ=WEEKLY;BYDAY=TU,TH',
                startDate      : new Date(2019, 9, 15, 13)
            }])
        });

        resourceStore = new ResourceStore({
            data : t.getHackathonData().resources.rows
        });

        calendar = await getCalendar({
            date         : new Date(2019, 9, 14),
            eventStore,
            resourceStore,
            mode         : 'month',
            modeDefaults : {
                eventRenderer : function({ eventRecord, renderData }) {
                    // highlight all events which are related to conferences
                    if (eventRecord.name.indexOf('conference') !== -1) {
                        renderData.style.textDecoration = 'underline';
                        renderData.cls['conference-event'] = true;
                    }
                }
            }
        });

        t.chain(
            { click : '.b-calendar-cell[data-date="2019-10-20"] .b-cal-cell-overflow' },

            { waitForSelector : '.b-overflowpopup' },

            { click : '.b-calendar-cell[data-date="2019-10-20"] .b-week-num' },

            // Overflow popup must go.
            { waitForSelectorNotFound : '.b-overflowpopup:visible' }
        );
    });

    t.it('Allow tbar to be configured away', async t => {
        eventStore = new EventStore({
            // Add a recurring meeting
            data : t.getHackathonData().events.rows.concat([{
                duration       : 1,
                durationUnit   : 'hour',
                id             : 'twice-weekly',
                name           : 'Recurring Meeting',
                recurrenceRule : 'FREQ=WEEKLY;BYDAY=TU,TH',
                startDate      : new Date(2019, 9, 15, 13)
            }])
        });

        resourceStore = new ResourceStore({
            data : t.getHackathonData().resources.rows
        });

        calendar = await getCalendar({
            date : new Date(2019, 9, 14),
            eventStore,
            resourceStore,
            mode : 'month',

            // Kills the Calendar's preconfigured toolbar
            tbar : false
        });

        // If this test executes with no errors and has no top toolbar, that's a pass
        t.selectorCountIs('.b-calendar .b-calendar-body-wrap > .b-top-toolbar', 0, 'Top toolbar correctly not present');
    });

    t.it('Day spanning event', async t => {
        calendar = await getCalendar({
            sidebar    : false,
            height     : 300,
            width      : 500,
            date       : '2020-06-01',
            eventStore : t.getEventStore({
                data : [{
                    name      : 'Multi day event',
                    startDate : '2020-06-01T12:00:00',
                    endDate   : '2020-06-04T12:00:00'
                }]
            }),
            modes : {
                agenda : null,
                year   : null,
                month  : null,
                day    : null
            }
        });

        const weekView = calendar.modes.week;

        t.isApproxPx(parseInt(weekView.allDayEvents.getEventElement(calendar.eventStore.first).style.width), 57, 'Event correctly spans 4 days');
    });

    t.it('Should refresh sparsely', async t => {
        calendar = await getCalendar({
            appendTo : document.body,
            date     : new Date(2020, 5, 25),
            width    : 1024,
            height   : 768,
            modes    : {
                day    : null,
                week   : null,
                agenda : null,
                year   : null
            }
        });

        // Called twice now, initial and on filter
        t.isCalledNTimes('refresh', calendar.modes.month, 2);

        calendar.resourceStore.data = [
            { id : 1, name : 'Work', eventColor : '#0000ff' }
        ];

        calendar.eventStore.data = [
            { id : 1, resourceId : 1, name : 'Bug bash', startDate : new Date(2020, 5, 25), duration : 1 }
        ];

        await t.waitForSelector('.b-cal-event');

        t.selectorExists('.b-cal-event[style*=color]', 'Event has color right away');

        t.chain(
            {
                waitForEvent : [calendar.modes.month, 'refresh'],
                trigger      : { click : '[data-ref="resourceFilter"] .b-list-item.b-selected' }
            },

            next => {
                t.selectorNotExists('.b-cal-event-wrap', 'Event filtered out');
                next();
            },

            // We expect nothing to happen - that's the test, so we cannot wait for anything.
            // The test is to wait for any spurious refresh events. We are expecting only 2:
            // The refresh from setting the eventStore data, and the refresh from filtering
            { waitFor : 300 }
        );
    });

    t.it('Should fire just one refresh event upon first render', async t => {
        calendar = await t.getCalendar({
            date   : new Date(2020, 9, 11),
            events : [{
                name      : 'Just One',
                startDate : '2020-10-11T09:00',
                endDate   : '2020-10-11T10:00'
            }],
            appendTo : document.body,
            mode     : 'week'
        });

        await t.waitForSelector('.b-cal-event');

        t.firesOnce(calendar.modes.agenda, 'refresh');
        calendar.mode = 'agenda';

        // Wait for the bug condition: extraneous refresh events arriving.
        await t.waitFor(300);
    });

    t.it('Events with no startDate should be omitted with no errors', async t => {
        eventStore = new EventStore({
            // Unscheduled event
            data : [{}]
        });

        resourceStore = new ResourceStore({
            data : []
        });

        // Bug was an error throw.
        calendar = await getCalendar({
            date : new Date(2019, 9, 14),
            eventStore,
            resourceStore
        });

        await t.waitFor(() => calendar.activeView?.refreshCount);
        t.pass('Test passed');
    });

    t.it('EventStore date range change events', async t => {
        const loadDateRangeEvents = [];

        calendar = await getCalendar({
            sidebar    : false,
            mode       : 'day',
            data       : [],
            date       : new Date(2019, 9, 13),
            eventStore : {
                listeners : {
                    loadDateRange(e) {
                        loadDateRangeEvents.push(e);
                    }
                }
            }
        });

        t.chain(
            async() => t.is(calendar.mode, 'day'),

            next => {
                // DayView
                t.isDeeply(loadDateRangeEvents[0].old, {});
                t.isDeeply(loadDateRangeEvents[0].new, {
                    startDate : new Date(2019, 9, 13),
                    endDate   : new Date(2019, 9, 14)
                });
                next();
            },

            { click : 'button:contains(Week)' },

            { waitFor : () => loadDateRangeEvents.length === 2 },

            async() => t.is(calendar.mode, 'week'),

            next => {
                // WeekView
                t.isDeeply(loadDateRangeEvents[1].old, {
                    startDate : new Date(2019, 9, 13),
                    endDate   : new Date(2019, 9, 14)
                });
                t.isDeeply(loadDateRangeEvents[1].new, {
                    startDate : new Date(2019, 9, 13),
                    endDate   : new Date(2019, 9, 20)
                });
                next();
            },

            { click : 'button:contains(Month)' },

            async() => t.is(calendar.mode, 'month'),

            next => {
                // MonthView
                t.isDeeply(loadDateRangeEvents[2].old, {
                    startDate : new Date(2019, 9, 13),
                    endDate   : new Date(2019, 9, 20)
                });
                t.isDeeply(loadDateRangeEvents[2].new, {
                    startDate : new Date(2019, 8, 29),
                    endDate   : new Date(2019, 10, 10)
                });
                next();
            },

            { click : 'button:contains(Year)' },

            async() => t.is(calendar.mode, 'year'),

            next => {
                // YearView
                t.isDeeply(loadDateRangeEvents[3].old, {
                    startDate : new Date(2019, 8, 29),
                    endDate   : new Date(2019, 10, 10)
                });
                t.isDeeply(loadDateRangeEvents[3].new, {
                    startDate : new Date(2018, 11, 30),
                    endDate   : new Date(2020, 0, 12)
                });
                next();
            },

            { click : 'button:contains(Day)' },

            async() => t.is(calendar.mode, 'day'),

            { click : 'button[data-ref="prevButton"]' },

            next => {
                t.isDeeply(loadDateRangeEvents[4].old, {
                    startDate : new Date(2018, 11, 30),
                    endDate   : new Date(2020, 0, 12)
                });
                t.isDeeply(loadDateRangeEvents[4].new, {
                    startDate : new Date(2019, 9, 12),
                    endDate   : new Date(2019, 9, 13)
                });
                next();
            },

            { click : 'button[data-ref="nextButton"]' },

            next => {
                t.isDeeply(loadDateRangeEvents[5].old, {
                    startDate : new Date(2019, 9, 12),
                    endDate   : new Date(2019, 9, 13)
                });
                t.isDeeply(loadDateRangeEvents[5].new, {
                    startDate : new Date(2019, 9, 13),
                    endDate   : new Date(2019, 9, 14)
                });
                next();
            },

            { click : 'button:contains(Week)' },

            async() => t.is(calendar.mode, 'week'),

            { click : 'button[data-ref="prevButton"]' },

            next => {
                t.isDeeply(loadDateRangeEvents[6].old, {
                    startDate : new Date(2019, 9, 13),
                    endDate   : new Date(2019, 9, 14)
                });
                t.isDeeply(loadDateRangeEvents[6].new, {
                    startDate : new Date(2019, 9, 6),
                    endDate   : new Date(2019, 9, 13)
                });
                next();
            },

            { click : 'button[data-ref="nextButton"]' },

            next => {
                t.isDeeply(loadDateRangeEvents[7].old, {
                    startDate : new Date(2019, 9, 6),
                    endDate   : new Date(2019, 9, 13)
                });
                t.isDeeply(loadDateRangeEvents[7].new, {
                    startDate : new Date(2019, 9, 13),
                    endDate   : new Date(2019, 9, 20)
                });
                next();
            },

            { click : 'button:contains(Month)' },

            async() => t.is(calendar.mode, 'month'),

            { click : 'button[data-ref="prevButton"]' },

            next => {
                t.isDeeply(loadDateRangeEvents[8].old, {
                    startDate : new Date(2019, 9, 13),
                    endDate   : new Date(2019, 9, 20)
                });
                t.isDeeply(loadDateRangeEvents[8].new, {
                    startDate : new Date(2019, 8, 1),
                    endDate   : new Date(2019, 9, 13)
                });
                next();
            },

            { click : 'button[data-ref="nextButton"]' },

            next => {
                t.isDeeply(loadDateRangeEvents[9].old, {
                    startDate : new Date(2019, 8, 1),
                    endDate   : new Date(2019, 9, 13)
                });
                t.isDeeply(loadDateRangeEvents[9].new, {
                    startDate : new Date(2019, 8, 29),
                    endDate   : new Date(2019, 10, 10)
                });
                next();
            },

            { click : 'button:contains(Year)' },

            async() => t.is(calendar.mode, 'year'),

            { click : 'button[data-ref="prevButton"]' },

            next => {
                t.isDeeply(loadDateRangeEvents[10].old, {
                    startDate : new Date(2019, 8, 29),
                    endDate   : new Date(2019, 10, 10)
                });
                t.isDeeply(loadDateRangeEvents[10].new, {
                    startDate : new Date(2017, 11, 31),
                    endDate   : new Date(2019, 0, 6)
                });
                next();
            },

            { click : 'button[data-ref="nextButton"]' },

            () => {
                // Exactly the expected number of data requests
                t.is(loadDateRangeEvents.length, 12);

                t.isDeeply(loadDateRangeEvents[11].old, {
                    startDate : new Date(2017, 11, 31),
                    endDate   : new Date(2019, 0, 6)
                });
                t.isDeeply(loadDateRangeEvents[11].new, {
                    startDate : new Date(2018, 11, 30),
                    endDate   : new Date(2020, 0, 12)
                });
            }
        );
    });

    // https://github.com/bryntum/support/issues/4494
    t.it('Should have eventMenu feature enabled by default', async t => {
        calendar = await getCalendar({
            events : [
                { resourceId : 1, startDate : '2020-08-31T09:00:00', duration : 3, durationUnit : 'h', name : 'Important meeting' }
            ],

            visibleStartTime : 7,
            date             : '2020-08-31'
        });

        await t.rightClick('.b-cal-event-wrap.b-past-event');
        await t.waitForSelector('.b-menu-content');
    });
});
