import { DateHelper, CSSHelper, DomHelper, Rectangle, EventStore, ResourceStore, MonthView } from '../../build/calendar.module.js?459414';

StartTest(t => {
    let calendar;

    const
        iconClasses = [
            'b-fa-circle',
            'b-fa-flag',
            'b-fa-clock',
            'b-fa-cloud',
            'b-fa-cog',
            'b-fa-diamond'
        ],
        trimNewLines = /[\r\n]/g;

    // eslint-disable-next-line no-unused-vars
    let monthView, eventStore, resourceStore;

    async function getMonthView(config) {
        // We need to override the MonthView's hardcoded minHeight because we
        // are testing with heights here.
        config.minHeight = undefined;
        const monthView = await t.getMonthView(config);

        // eslint-disable-next-line no-unused-vars
        eventStore = monthView.project.eventStore;
        resourceStore = monthView.project.resourceStore;

        return monthView;
    }

    t.beforeEach(t => {
        monthView?.destroy?.();
        calendar?.destroy();

        if (t.query('.b-overflowpopup:visible, .b-sch-event-tooltip, .b-eventeditor').length) {
            // Check that none of the floating things are persisting
            t.selectorNotExists('.b-overflowpopup:visible');
            t.selectorNotExists('.b-sch-event-tooltip');
            t.selectorNotExists('.b-eventeditor');
        }
    });

    t.it('sanity', async t => {
        const
            today = new Date(),
            firstDayOfMonth = DateHelper.clearTime(new Date()),
            lastDayOfMonth = DateHelper.clearTime(new Date()),
            swrSpy         = t.spyOn(MonthView.prototype, 'shrinkwrapWeekRow'),
            fwrSpy         = t.spyOn(MonthView.prototype, 'flexWeekRow');

        monthView = await getMonthView({
            height     : 500,
            width      : 700,
            eventStore : t.getEventStore({
                data : []
            })
        });

        firstDayOfMonth.setDate(monthView.month.startDayOfMonth);

        // align-items : center must only come in at the DatePicker level
        t.hasStyle(monthView.element.querySelector('.b-calendar-cell'), 'alignItems', 'normal');

        // Non-inclusive, or, if you prefer, it refers not to a 24 hour span, but
        // to the exact millisecond point that the view ends.
        lastDayOfMonth.setDate(monthView.month.endDayOfMonth + 1);

        // Work out what today's cell should contain.
        // If it's column 0, we have to include the week number.
        const todayCellText = `${today.getDay() === monthView.month.weekStartDay ? monthView.month.getWeekNumber(today)[1] : ''}${String(today.getDate())}`;

        // Check that the cell is accessed and contains the day's number
        t.is(monthView.getCell(today).innerText.replace(trimNewLines, ''), todayCellText, 'Today\'s cell has correct content');

        t.notOk(monthView.startDate - firstDayOfMonth, 'startDate is correct');
        t.notOk(monthView.endDate - lastDayOfMonth, 'endDate is correct');

        // No Events
        t.selectorCountIs('.b-cal-event-wrap', 0);

        // Check that zero duration events (reminders) at limits are rendered
        const firstCellEvent = monthView.eventStore.add({
            name      : 'test',
            startDate : monthView.startDate,
            endDate   : monthView.startDate
        })[0];

        await t.waitForEvent(monthView, 'refresh');

        t.selectorExists(`[data-date="${DateHelper.format(monthView.startDate, 'YYYY-MM-DD')}"] [data-event-id="${firstCellEvent.id}"].b-cal-event-wrap`, 1);

        // endDate is exclusive. It's 00:00:00 of the date after the last cell
        const lastCellEvent = monthView.eventStore.add({
            name      : 'test',
            startDate : DateHelper.add(monthView.endDate, -1, 'day'),
            endDate   : DateHelper.add(monthView.endDate, -1, 'day')
        })[0];

        await t.waitForEvent(monthView, 'refresh');

        t.selectorExists(`[data-date="${DateHelper.format(DateHelper.add(monthView.endDate, -1, 'day'), 'YYYY-MM-DD')}"] [data-event-id="${lastCellEvent.id}"].b-cal-event-wrap`, 1);

        // Check that hideNonWorkingDays works
        const isNotHideDisplay = el => el.ownerDocument.defaultView.getComputedStyle(el).getPropertyValue('display') !== 'none';

        t.is(
            Array.from(monthView.contentElement.querySelectorAll(`.${monthView.dayCellCls}`)).filter(isNotHideDisplay).length,
            42
        );

        monthView.hideNonWorkingDays = true;

        t.is(
            Array.from(monthView.contentElement.querySelectorAll(`.${monthView.dayCellCls}`)).filter(isNotHideDisplay).length,
            30
        );

        // These two complex methods should not be run by default.
        t.expect(swrSpy).not.toHaveBeenCalled();
        t.expect(fwrSpy).not.toHaveBeenCalled();
    });

    t.it('Prev/next should only gather events once', async t => {
        calendar = await t.getCalendar({
            events    : t.getHackathonData().events.rows,
            resources : t.getHackathonData().resources.rows,
            date      : new Date(2019, 9, 15),
            modes     : {
                day    : null,
                week   : null,
                year   : null,
                agenda : null
            }
        });
        const
            eventCount       = t.query('.b-cal-event-wrap').length,
            collectEventsSpy = t.spyOn(calendar.activeView, 'collectEvents').callThrough();

        await t.click('[data-ref="prevButton"]');

        // No events in September
        await t.waitFor(() => t.query('.b-cal-event-wrap').length === 0);

        await t.click('[data-ref="nextButton"]');

        // back to October's event set
        await t.waitFor(() => t.query('.b-cal-event-wrap').length === eventCount);

        // The navigation only caused two event collection runs.
        t.is(collectEventsSpy.calls.count(), 2);
    });

    t.it('hideNonWorkingDays', async t => {
        calendar = await t.getCalendar({
            events         : [],
            resources      : [],
            sidebar        : false,
            date           : '2022-02-08',
            nonWorkingDays : { 0 : true, 3 : true, 6 : true },
            modes          : {
                day   : null,
                week  : null,
                month : {
                    hideNonWorkingDays : true
                },
                year   : null,
                agenda : null
            }
        });

        // Wait for layout to be correct
        await t.waitForAnimationFrame();

        await t.dragBy({
            source : '.b-calendar-cell[data-date="2022-02-08"] .b-cal-event-bar-container',
            offset : ['50%', '50%'],
            delta  : [220, 0]
        });

        await t.waitFor(() => calendar.features.eventEdit.editor?.containsFocus);

        await t.type(null, 'New Event[ENTER]');

        const
            event   = calendar.eventStore.first,
            eventEl = calendar.activeView.getEventElement(calendar.eventStore.first);

        // It only covers 2 of the 4 cells (8 & 10) because Sunday, Wednesday (9th) and Saturday are all missing
        t.is(parseInt(eventEl.style.width), 2 / 4 * 100, 'width correct');

        // Runs from Tue 8th to Thu 10th
        t.is(DateHelper.floor(event.startDate, '1 day'), new Date(2022, 1, 8));
        t.is(DateHelper.ceil(event.endDate, '1 day'), new Date(2022, 1, 11));
    });

    t.it('One day events', async t => {
        const eventStore = t.getEventStore({
            data : (function() {
                const events = [];
                for (let i = 1; i <= 5; i++) {
                    events.push({
                        id         : i,
                        cls        : 'event' + i,
                        resourceId : 'r' + i,
                        name       : 'Assignment ' + i,
                        startDate  : new Date(2011, 0, 3 + i),
                        endDate    : new Date(2011, 0, 4 + i),
                        iconCls    : iconClasses[i]
                    });
                }

                return events;
            })()
        });

        resourceStore = t.getResourceStore({
            data : [
                { id : 'r1', name : 'Mike',  eventColor : 'red' },
                { id : 'r2', name : 'Linda', eventColor : 'orange' },
                { id : 'r3', name : 'Don',   eventColor : '#f1c114' },
                { id : 'r4', name : 'Karen', eventColor : 'green' },
                { id : 'r5', name : 'Doug',  eventColor : 'blue' },
                { id : 'r6', name : 'Peter', eventColor : 'indigo' }
            ]
        });

        monthView = await getMonthView({
            width  : 1000,
            height : 750,
            date   : new Date(2011, 0, 1),
            eventStore,
            resourceStore
        });

        // Check correct single day widths
        monthView.eventElements.forEach(el => t.isApprox(el.getBoundingClientRect().width, monthView.weekWidth / 7, 0.5));

        // Test fix for https://github.com/bryntum/support/issues/3417
        t.selectorCountIs('.b-cal-event-icon:visible', 5, 'allDay event icons rendered and visible');
    });

    t.it('Interaction', async t => {
        const eventStore = t.getEventStore({
            data : (function() {
                const events = [];
                for (let i = 1; i <= 5; i++) {
                    events.push({
                        id         : i,
                        cls        : 'event' + i,
                        resourceId : 'r' + i,
                        name       : 'Assignment ' + i,
                        startDate  : new Date(2011, 0, 3 + i),
                        endDate    : new Date(2011, 0, 4 + i),
                        iconCls    : iconClasses[i]
                    });
                }

                return events;
            })()
        });

        resourceStore = t.getResourceStore({
            data : [
                { id : 'r1', name : 'Mike',  eventColor : 'red' },
                { id : 'r2', name : 'Linda', eventColor : 'orange' },
                { id : 'r3', name : 'Don',   eventColor : '#f1c114' },
                { id : 'r4', name : 'Karen', eventColor : 'green' },
                { id : 'r5', name : 'Doug',  eventColor : 'blue' },
                { id : 'r6', name : 'Peter', eventColor : 'indigo' }
            ]
        });

        monthView = await getMonthView({
            width  : 1000,
            height : 750,
            date   : new Date(2011, 0, 1),
            eventStore,
            resourceStore
        });

        [
            'weeknumbermousedown',
            'weeknumbermouseup',
            'weeknumberclick',
            'daynumbermousedown',
            'daynumbermouseup',
            'daynumberclick',
            'eventmouseover',
            'eventmousedown',
            'eventmouseup',
            'eventclick'
        ].forEach(eventName => t.firesOnce(monthView, eventName));

        t.chain(
            { click : '.b-week-num' },

            { click : '.b-day-num' },

            { click : '.b-cal-event' }
        );
    });

    t.it('Two day events', async t => {
        const eventStore = t.getEventStore();

        resourceStore = t.getResourceStore({
            data : [
                { id : 'r1', name : 'Mike',  eventColor : 'red' },
                { id : 'r2', name : 'Linda', eventColor : 'orange' },
                { id : 'r3', name : 'Don',   eventColor : '#f1c114' },
                { id : 'r4', name : 'Karen', eventColor : 'green' },
                { id : 'r5', name : 'Doug',  eventColor : '#0000ff' },
                { id : 'r6', name : 'Peter', eventColor : 'indigo' }
            ]
        });

        monthView = await getMonthView({
            width  : 1000,
            height : 750,
            date   : new Date(2011, 0, 1),
            eventStore,
            resourceStore
        });

        // Check correct two day widths for non-split events
        monthView.eventElements.slice(0, 4).forEach(el => t.isApprox(el.getBoundingClientRect().width, monthView.weekWidth / 7 * 2, 0.5));

        const
            e5   = monthView.eventStore.getAt(4),
            e5El = monthView.getEventElements(e5);

        let chunk0BackgroundColor = window.getComputedStyle(e5El[0].querySelector('.b-cal-event')).backgroundColor,
            chunk1BackgroundColor = window.getComputedStyle(e5El[1].querySelector('.b-cal-event')).backgroundColor;

        const
            allDayEventRule       = CSSHelper.findRule('.b-solid-bar .b-cal-event'),
            allDayBackgroundColor = allDayEventRule.style.getPropertyValue('background-color');

        // Check that the event bars have correctly inherited the event's resource's declared color
        t.ok(chunk0BackgroundColor === 'rgb(0, 0, 255)' || chunk0BackgroundColor === '#0000ff');
        t.ok(chunk1BackgroundColor === 'rgb(0, 0, 255)' || chunk1BackgroundColor === '#0000ff');

        // Should drop to using the default all day event background colour
        e5.resource.eventColor = null;

        await t.waitForEvent(monthView, 'refresh');

        // Reacquire colour styles now that they must have changed.
        chunk0BackgroundColor = window.getComputedStyle(e5El[0].querySelector('.b-cal-event')).backgroundColor;
        chunk1BackgroundColor = window.getComputedStyle(e5El[1].querySelector('.b-cal-event')).backgroundColor;

        // Check that the event bars have correctly dropped back to the default background colour
        t.ok(chunk0BackgroundColor === allDayBackgroundColor);
        t.ok(chunk1BackgroundColor === allDayBackgroundColor);
    });

    t.it('Multi day spanning events', async t => {
        const eventStore = t.getEventStore();

        resourceStore = t.getResourceStore({
            data : [
                { id : 'r1', name : 'Mike',  eventColor : 'red' },
                { id : 'r2', name : 'Linda', eventColor : 'orange' },
                { id : 'r3', name : 'Don',   eventColor : '#f1c114' },
                { id : 'r4', name : 'Karen', eventColor : 'green' },
                { id : 'r5', name : 'Doug',  eventColor : 'blue' },
                { id : 'r6', name : 'Peter', eventColor : 'indigo' }
            ]
        });

        monthView = await getMonthView({
            width       : 1000,
            height      : 750,
            date        : new Date(2011, 0, 1),
            eventHeight : 18,
            eventStore,
            resourceStore
        });

        const
            e1 = eventStore.first,
            e2 = eventStore.getAt(1),
            e3 = eventStore.getAt(2),
            e4 = eventStore.getAt(3),
            e5 = eventStore.getAt(4);

        let cell7       = monthView.cellMap.get('2011-01-07'),
            cell8       = monthView.cellMap.get('2011-01-08'),
            cell8Events = cell8.renderedEvents,
            renderedIds = cell8Events.slots.map(s => s.eventRecord.id),
            cell14new1;

        // Two events covering the 8th
        // 4, and the 8th's own event, 5
        t.is(cell8Events.slots.length, 2);

        // 4 was at slot 1 in its originating cell, so that's where it is in this cell.
        // So 5 went in at slot 0
        t.isDeeply(renderedIds, [5, 4]);

        // No overflow indicators
        t.selectorCountIs('.b-cal-cell-overflow', 0);

        e1.duration = 5;

        await t.waitForEvent(monthView, 'refresh');

        // Wait for the data state to be correct
        await t.waitFor(() => {
            cell8Events = monthView.cellMap.get('2011-01-08').renderedEvents;

            return cell8Events.slots.length === 3;
        });

        renderedIds = cell8Events.slots.map(s => s.eventRecord.id);

        // Now there are three events covering the 8th.
        // 1, 4, and the 8th's own event, 5
        t.is(cell8Events.slots.length, 3);
        t.isDeeply(renderedIds, [1, 4, 5]);

        // Still no overflow indicators
        t.selectorCountIs('.b-cal-cell-overflow', 0);

        e2.duration = 5;

        await t.waitForEvent(monthView, 'refresh');

        // Wait for the data state to be correct
        await t.waitFor(() => {
            cell8Events = monthView.cellMap.get('2011-01-08').renderedEvents;

            return cell8Events.slots.length === 4;
        });

        renderedIds = cell8Events.slots.map(s => s.eventRecord.id);

        // Now there are three events covering the 8th.
        // 1, 2, the 8th's own event, 5, then 4
        t.is(cell8Events.slots.length, 4);
        t.isDeeply(renderedIds, [1, 2, 5, 4]);

        // Still no overflow indicators
        t.selectorCountIs('.b-cal-cell-overflow', 0);

        const cell8new1 = monthView.eventStore.add({
            startDate : new Date(2011, 0, 8, 9),
            endDate   : new Date(2011, 0, 8, 10),
            name      : 'cell8 New1'
        })[0];

        await t.waitForEvent(monthView, 'refresh');

        // Wait for the data state to be correct
        await t.waitFor(() => {
            cell8Events = monthView.cellMap.get('2011-01-08').renderedEvents;

            return cell8Events.slots.length === 5;
        });

        cell7 = monthView.cellMap.get('2011-01-07');
        cell8 = monthView.cellMap.get('2011-01-08');
        cell8Events = cell8.renderedEvents;
        renderedIds = cell8Events.slots.map(s => s.eventRecord.id);

        // Both 7th and 8th must be flagged as overflowing.
        // The 7th, although not overflowing, must display a +1 more indicator
        // because it cannot spread its last event into the 8th, because
        // the 8th needs a visible "+2 more indicator" there.
        // See below. We are processing that second cell.
        // If the second cell was not overflowing, it would be fine.
        // But because it needs its own "+1 More" indicator, that originating
        // cell must also get a "+1 More" indicator even if it's not overflowing
        // because it must not obscure that next cell's "+2 More indicator".
        // +----------+----------+
        // |  Jan 07  |  Jan 08  |
        // +----------+----------|
        // |  Event   |  Event   |
        // |  Event   |  Event   |
        // |  Event   |  Event   |
        // |  EventWhichIsLong   |
        // +----------+----------+
        //               Event
        t.is(cell7.hasOverflow, true);
        t.is(cell8.hasOverflow, true);

        // Now there are three events covering the 8th.
        // 1, 2, the 8th's own event, 5, then 4, then the new, intra-day event
        t.is(cell8Events.slots.length, 5);
        t.isDeeply(renderedIds, [1, 2, 5, 4, cell8new1.id]);

        // Start interacting
        t.chain(
            next => {
                t.selectorCountIs('.b-cal-cell-overflow', 2);
                next();
            },

            { click : '[data-date="2011-01-07"] .b-cal-cell-overflow:contains(+1 more)' },

            { waitFor : () => monthView.overflowPopup.isVisible },

            next => {
                t.selectorCountIs(`#${monthView.overflowPopup.element.id} .b-cal-event-wrap.b-allday`, 4);
                t.selectorExists(`#${monthView.overflowPopup.element.id} .b-cal-event-wrap.b-allday[data-event-id="1"].b-continues-left.b-continues-right:contains(${e1.name})`);
                t.selectorExists(`#${monthView.overflowPopup.element.id} .b-cal-event-wrap.b-allday[data-event-id="2"].b-continues-left.b-continues-right:contains(${e2.name})`);
                t.selectorExists(`#${monthView.overflowPopup.element.id} .b-cal-event-wrap.b-allday[data-event-id="3"].b-continues-left:not(b-continues-right):contains(${e3.name})`);
                t.selectorExists(`#${monthView.overflowPopup.element.id} .b-cal-event-wrap.b-allday[data-event-id="4"]:not(b-continues-left).b-continues-right:contains(${e4.name})`);
                next();
            },

            { click : '[data-date="2011-01-08"] .b-cal-cell-overflow:contains(+2 more)' },

            next => {
                t.selectorCountIs(`#${monthView.overflowPopup.element.id} .b-cal-event-wrap.b-allday`, 4);
                t.selectorCountIs(`#${monthView.overflowPopup.element.id} .b-cal-event-wrap.b-intraday`, 1);
                t.selectorExists(`#${monthView.overflowPopup.element.id} .b-cal-event-wrap.b-allday[data-event-id="1"].b-continues-left:not(.b-continues-right):contains(${e1.name})`);
                t.selectorExists(`#${monthView.overflowPopup.element.id} .b-cal-event-wrap.b-allday[data-event-id="2"].b-continues-left.b-continues-right:contains(${e2.name})`);
                t.selectorExists(`#${monthView.overflowPopup.element.id} .b-cal-event-wrap.b-allday[data-event-id="4"].b-continues-left:not(b-continues-right):contains(${e4.name})`);
                t.selectorExists(`#${monthView.overflowPopup.element.id} .b-cal-event-wrap.b-allday[data-event-id="5"]:not(b-continues-left).b-continues-right:contains(${e5.name})`);
                t.selectorExists(`#${monthView.overflowPopup.element.id} .b-cal-event-wrap.b-intraday[data-event-id="${cell8new1.id}"]:not(b-continues-left):not(b-continues-right):contains(${cell8new1.name})`);

                monthView.overflowPopup.close();
                next();
            },

            { waitFor : () => !monthView.overflowPopup.isVisible },

            async() => {
                e1.duration = 11;

                await t.waitForEvent(monthView, 'refresh');

                // e1 has now nudged over into next week
                t.isDeeply(monthView.getCellEventIds('2011-01-09'), [1, 2, 5]);
                t.isDeeply(monthView.getCellEventIds('2011-01-10'), [1]);
                t.isDeeply(monthView.getCellEventIds('2011-01-11'), [1]);
                t.isDeeply(monthView.getCellEventIds('2011-01-12'), [1]);
                t.isDeeply(monthView.getCellEventIds('2011-01-13'), [1]);
                t.isDeeply(monthView.getCellEventIds('2011-01-14'), [1]);

                e2.duration = 10;

                await t.waitForEvent(monthView, 'refresh');

                // e2 now extends to the 14th
                t.isDeeply(monthView.getCellEventIds('2011-01-09'), [1, 2, 5]);
                t.isDeeply(monthView.getCellEventIds('2011-01-10'), [1, 2]);
                t.isDeeply(monthView.getCellEventIds('2011-01-11'), [1, 2]);
                t.isDeeply(monthView.getCellEventIds('2011-01-12'), [1, 2]);
                t.isDeeply(monthView.getCellEventIds('2011-01-13'), [1, 2]);
                t.isDeeply(monthView.getCellEventIds('2011-01-14'), [1, 2]);

                e3.duration = 9;

                await t.waitForEvent(monthView, 'refresh');

                t.selectorExists('[data-date="2011-01-08"] .b-cal-cell-overflow:contains(+3 more)');

                // e3 now extends to the 14th
                t.isDeeply(monthView.getCellEventIds('2011-01-09'), [1, 2, 3, 5]);
                t.isDeeply(monthView.getCellEventIds('2011-01-10'), [1, 2, 3]);
                t.isDeeply(monthView.getCellEventIds('2011-01-11'), [1, 2, 3]);
                t.isDeeply(monthView.getCellEventIds('2011-01-12'), [1, 2, 3]);
                t.isDeeply(monthView.getCellEventIds('2011-01-13'), [1, 2, 3]);
                t.isDeeply(monthView.getCellEventIds('2011-01-14'), [1, 2, 3]);

                e5.duration = 7;

                await t.waitForEvent(monthView, 'refresh');

                // e5 now extends to the 14th
                t.isDeeply(monthView.getCellEventIds('2011-01-09'), [1, 2, 3, 5]);
                t.isDeeply(monthView.getCellEventIds('2011-01-10'), [1, 2, 3, 5]);
                t.isDeeply(monthView.getCellEventIds('2011-01-11'), [1, 2, 3, 5]);
                t.isDeeply(monthView.getCellEventIds('2011-01-12'), [1, 2, 3, 5]);
                t.isDeeply(monthView.getCellEventIds('2011-01-13'), [1, 2, 3, 5]);
                t.isDeeply(monthView.getCellEventIds('2011-01-14'), [1, 2, 3, 5]);
            },

            {
                waitForEvent : [monthView, 'refresh'],
                trigger      : () =>                 cell14new1 = monthView.eventStore.add({
                    startDate : new Date(2011, 0, 14),
                    endDate   : new Date(2011, 0, 15),
                    name      : 'cell14 New1'
                })[0]
            },

            next => {
                // 9th to the 14th all have an overflow indicator now
                t.selectorCountIs('.b-cal-cell-overflow', 8);
                t.selectorExists('[data-date="2011-01-09"] .b-cal-cell-overflow:contains(+1 more)');
                t.selectorExists('[data-date="2011-01-10"] .b-cal-cell-overflow:contains(+1 more)');
                t.selectorExists('[data-date="2011-01-11"] .b-cal-cell-overflow:contains(+1 more)');
                t.selectorExists('[data-date="2011-01-12"] .b-cal-cell-overflow:contains(+1 more)');
                t.selectorExists('[data-date="2011-01-13"] .b-cal-cell-overflow:contains(+1 more)');
                t.selectorExists('[data-date="2011-01-14"] .b-cal-cell-overflow:contains(+2 more)');
                next();
            },

            next => {
                // Check the flag in the cell data block
                t.is(monthView.cellMap.get('2011-01-09').hasOverflow, true, '9th has overflow');
                t.is(monthView.cellMap.get('2011-01-10').hasOverflow, true, '10th has overflow');
                t.is(monthView.cellMap.get('2011-01-11').hasOverflow, true, '11th has overflow');
                t.is(monthView.cellMap.get('2011-01-12').hasOverflow, true, '12th has overflow');
                t.is(monthView.cellMap.get('2011-01-13').hasOverflow, true, '13th has overflow');
                t.is(monthView.cellMap.get('2011-01-14').hasOverflow, true, '14th has overflow');

                // The 14th has a new one
                t.isDeeply(monthView.getCellEventIds('2011-01-09'), [1, 2, 3, 5]);
                t.isDeeply(monthView.getCellEventIds('2011-01-10'), [1, 2, 3, 5]);
                t.isDeeply(monthView.getCellEventIds('2011-01-11'), [1, 2, 3, 5]);
                t.isDeeply(monthView.getCellEventIds('2011-01-12'), [1, 2, 3, 5]);
                t.isDeeply(monthView.getCellEventIds('2011-01-13'), [1, 2, 3, 5]);
                t.isDeeply(monthView.getCellEventIds('2011-01-14'), [1, 2, 3, 5, cell14new1.id]);

                next();
            }
        );
    });

    t.it('Custom calculatePropagateEndDate', async t => {
        class MyMonthView extends MonthView {
            static get name() {
                return 'NonPropagatingMonthView';
            }

            static get type() {
                return 'nonpropagatingmonthview';
            }

            calculatePropagateEndDate(eventData) {
                if (!eventData.overflows) {
                    return super.calculatePropagateEndDate(eventData);
                }
                // Overflowing events are truncated
                return DateHelper.add(DateHelper.clearTime(eventData.eventRecord.startDate), 1, 'd');
            }
        }
        MyMonthView.initClass();

        calendar = await t.getCalendar({
            events    : t.getHackathonData().events.rows,
            resources : t.getHackathonData().resources.rows,
            sidebar   : false,
            date      : new Date(2019, 9, 14),
            modes     : {
                day   : null,
                week  : null,
                month : {
                    type : 'nonpropagatingmonthview'
                },
                year   : null,
                agenda : null
            }
        });

        t.selectorCountIs('.b-cal-event-wrap.b-allday[data-event-id="1"]', 1, 'Long event only represented once');
    });

    t.it('Custom propagateEndDate using the eventPropagate event', async t => {
        calendar = await t.getCalendar({
            events    : t.getHackathonData().events.rows,
            resources : t.getHackathonData().resources.rows,
            sidebar   : false,
            date      : new Date(2019, 9, 14),
            modes     : {
                day    : null,
                year   : null,
                agenda : null
            },
            listeners : {
                eventPropagate(eventData) {
                    if (eventData.overflows) {
                        // Overflowing events are truncated
                        eventData.propagateEndDate = DateHelper.add(DateHelper.clearTime(eventData.eventRecord.startDate), 1, 'd');
                    }
                }
            }
        });

        // The listener at the Calendar level will work for all views.
        // both week and month view must truncate the hackathon bar to only one day
        t.selectorCountIs('.b-cal-event-wrap.b-allday[data-event-id="1"]:visible', 1, 'Long event only represented once');

        calendar.mode = 'month';

        await t.waitForAnimations();

        t.selectorCountIs('.b-cal-event-wrap.b-allday[data-event-id="1"]:visible', 1, 'Long event only represented once');
    });

    t.it('No events starting in the month', async t => {
        const eventStore = t.getEventStore({
            data : [{
                id         : 'longEvent',
                cls        : 'event1',
                resourceId : 'r1',
                name       : 'Assignment 1',
                startDate  : new Date(2010, 11, 25),
                endDate    : new Date(2011, 0, 10)
            }]
        });

        monthView = await getMonthView({
            width  : 1000,
            height : 750,
            date   : new Date(2011, 0, 1),
            eventStore
        });

        const eventElements = monthView.bodyElement.querySelectorAll('.b-cal-event-wrap:not(.b-overflow)');

        t.isApprox(eventElements[0].getBoundingClientRect().width, monthView.weekWidth, 0.5);
        t.isApprox(eventElements[1].getBoundingClientRect().width, monthView.weekWidth, 0.5);
        t.isApprox(eventElements[2].getBoundingClientRect().width, monthView.weekWidth / 7, 0.5);
    });

    t.it('No events ending in the month', async t => {
        const eventStore = t.getEventStore({
            data : [{
                id         : 'longEvent',
                cls        : 'event1',
                resourceId : 'r1',
                name       : 'Assignment 1',
                startDate  : new Date(2011, 0, 25),
                endDate    : new Date(2011, 1, 10)
            }]
        });

        monthView = await getMonthView({
            width  : 1000,
            height : 750,
            date   : new Date(2011, 0, 1),
            eventStore
        });

        // eslint-disable-next-line no-unused-vars
        const eventElements = monthView.bodyElement.querySelectorAll('.b-cal-event-wrap:not(.b-overflow)');
    });

    t.it('No events intersecting the month', async t => {
        const eventStore = t.getEventStore({
            data : [{
                id         : 'e1',
                cls        : 'event1',
                resourceId : 'r1',
                name       : '2 day event 1',
                startDate  : new Date(2010, 11, 24),
                endDate    : new Date(2010, 11, 26)
            }, {
                id         : 'e2',
                cls        : 'event2',
                resourceId : 'r2',
                name       : '2 day event 2',
                startDate  : new Date(2011, 1, 6),
                endDate    : new Date(2011, 1, 8)
            }, {
                id         : 'e3',
                cls        : 'event3',
                resourceId : 'r1',
                name       : '1 day event 1',
                startDate  : new Date(2010, 11, 25),
                endDate    : new Date(2010, 11, 26)
            }, {
                id         : 'e4',
                cls        : 'event4',
                resourceId : 'r2',
                name       : '1 day event 2',
                startDate  : new Date(2011, 1, 6),
                endDate    : new Date(2011, 1, 7)
            }]
        });

        monthView = await getMonthView({
            width  : 1000,
            height : 750,
            date   : new Date(2011, 0, 1),
            eventStore
        });

        const eventElements = monthView.bodyElement.querySelectorAll('.b-cal-event-wrap:not(.b-overflow)');

        t.is(eventElements.length, 0, 'No event elements');

        // No event data cells
        t.is(monthView.cellMap.size, 0);
    });

    t.it('Events intersecting start and end of month by one day', async t => {
        const eventStore = t.getEventStore({
            data : [{
                id         : 'e1',
                cls        : 'event1',
                resourceId : 'r1',
                name       : '2 day event 1',
                startDate  : new Date(2010, 11, 25),
                endDate    : new Date(2010, 11, 27)
            }, {
                id         : 'e2',
                cls        : 'event2',
                resourceId : 'r2',
                name       : '2 day event 2',
                startDate  : new Date(2011, 1, 5),
                endDate    : new Date(2011, 1, 7)
            }]
        });

        monthView = await getMonthView({
            width  : 1000,
            height : 750,
            date   : new Date(2011, 0, 1),
            eventStore
        });

        t.selectorCountIs('.b-cal-event-wrap.b-allday.b-continues-left', 1);
        t.selectorCountIs('.b-cal-event-wrap.b-allday.b-continues-right', 1);

        // Two event data cells
        t.is(monthView.cellMap.size, 2);
    });

    t.it('Events intersecting start and end of month by one second', async t => {
        const eventStore = t.getEventStore({
            data : [{
                id         : 'e1',
                cls        : 'event1',
                resourceId : 'r1',
                name       : '2 day event 1',
                startDate  : new Date(2010, 11, 25),
                endDate    : new Date(2010, 11, 26, 0, 0, 1)
            }, {
                id         : 'e2',
                cls        : 'event2',
                resourceId : 'r2',
                name       : '2 day event 2',
                startDate  : new Date(2011, 1, 5, 23, 59, 59),
                endDate    : new Date(2011, 1, 7)
            }]
        });

        monthView = await getMonthView({
            width  : 1000,
            height : 750,
            date   : new Date(2011, 0, 1),
            eventStore
        });

        t.selectorCountIs('.b-cal-event-wrap.b-allday.b-continues-left', 1);
        t.selectorCountIs('.b-cal-event-wrap.b-allday.b-continues-right', 1);

        // Two event data cells
        t.is(monthView.cellMap.size, 2);
    });

    t.it('No events starting or ending in the month, but an event *spanning* the month', async t => {
        const eventStore = t.getEventStore({
            data : [{
                id         : 'longEvent',
                cls        : 'event1',
                resourceId : 'r1',
                name       : 'Assignment 1',
                startDate  : new Date(2010, 11, 25),
                endDate    : new Date(2011, 1, 10)
            }]
        });

        monthView = await getMonthView({
            width  : 1000,
            height : 750,
            date   : new Date(2011, 0, 1),
            eventStore
        });

        const eventElements = monthView.bodyElement.querySelectorAll('.b-cal-event-wrap:not(.b-overflow)');

        t.is(eventElements.length, 6, 'six event start elements');

        // We should only have gathered cells for the view's own cells
        t.is(monthView.cellMap.size, 42);
    });

    t.it('Events overflowing a cell', async t => {
        const eventStore = t.getEventStore({
            data : [{
                id         : 'event1',
                cls        : 'event1',
                resourceId : 'r1',
                name       : 'Assignment 1',
                color      : 'red',
                startDate  : new Date(2011, 0, 10),
                endDate    : new Date(2011, 0, 10)
            }, {
                id         : 'event2',
                cls        : 'event2',
                resourceId : 'r1',
                name       : 'Assignment 2',
                color      : '#f1c114',
                startDate  : new Date(2011, 0, 10),
                endDate    : new Date(2011, 0, 10)
            }, {
                id         : 'event3',
                cls        : 'event3',
                resourceId : 'r1',
                name       : 'Assignment 3',
                color      : 'green',
                startDate  : new Date(2011, 0, 10),
                endDate    : new Date(2011, 0, 10)
            }, {
                id         : 'event4',
                cls        : 'event4',
                resourceId : 'r1',
                name       : 'Assignment 4',
                color      : 'blue',
                startDate  : new Date(2011, 0, 10),
                endDate    : new Date(2011, 0, 10)
            }, {
                id         : 'event5',
                cls        : 'event5',
                resourceId : 'r1',
                name       : 'Assignment 5',
                color      : 'indigo',
                startDate  : new Date(2011, 0, 10),
                endDate    : new Date(2011, 0, 10)
            }]
        });

        monthView = await getMonthView({
            width       : 1000,
            // Start small because we are testing overflow
            height      : 500,
            date        : new Date(2011, 0, 1),
            eventHeight : 20,
            eventStore
        });

        t.firesOnce(monthView, 'cellOverflowClick', 'Overflow indicator clicked only once');

        // At height 500, there's only space for two events
        t.selectorCountIs('.b-cal-event-wrap', 1);
        t.selectorExists('.b-cal-cell-overflow:contains(+4 more)');

        t.chain(
            { waitForEvent : [monthView, 'refresh'], trigger : () => monthView.height = 800 },

            next => {
                // At height 800, there's space for three plus the overflow indicator
                t.selectorCountIs('.b-cal-event-wrap', 3);
                t.selectorExists('.b-cal-cell-overflow:contains(+2 more)');
                next();
            },

            { waitForEvent : [monthView, 'refresh'], trigger : () => monthView.height = 700 },

            next => {
                // At height 700, there's space for two plus the overflow indicator
                t.selectorCountIs('.b-cal-event-wrap', 2);
                // Test fix for https://github.com/bryntum/support/issues/3409
                t.selectorCountIs('.b-cal-event-icon', 2, 'icons are rendered');
                t.selectorExists('.b-cal-cell-overflow:contains(+3 more)');

                eventStore.remove(eventStore.last);
                next();
            },

            { waitForEvent : [monthView, 'refresh'] },

            next => {
                t.selectorCountIs('.b-cal-event-wrap', 2);
                t.selectorExists('.b-cal-cell-overflow:contains(+2 more)');
                next();
            },

            { waitFor : () => monthView.overflowPopup.isVisible, trigger : { click : '.b-cal-cell-overflow' } },

            next => {
                t.selectorCountIs(`#${monthView.overflowPopup.id} .b-cal-event-wrap`, 4);
                // Test fix for https://github.com/bryntum/support/issues/3409
                t.selectorCountIs(`#${monthView.overflowPopup.id} .b-cal-event-icon`, 4, 'icons are rendered');
                next();
            },

            { click : () => monthView.overflowPopup.tools.close.element },

            // When were down to three, there's no need for the overflow indicator
            { waitForEvent : [monthView, 'refresh'], trigger : () => eventStore.remove(eventStore.last) },

            () => {
                t.selectorCountIs('.b-cal-event-wrap:visible', 3);
                // Test fix for https://github.com/bryntum/support/issues/3409
                t.selectorCountIs('.b-cal-event-icon:visible', 3, 'icons are rendered');
                t.selectorNotExists('.b-cal-cell-overflow');
            }
        );
    });

    t.it('weekStartDay', async t => {
        const eventStore = t.getEventStore({
            data : [{
                id         : 'longEvent',
                cls        : 'event1',
                resourceId : 'r1',
                name       : 'Assignment 1',
                startDate  : new Date(2010, 11, 25),
                endDate    : new Date(2011, 0, 10)
            }]
        });

        monthView = await getMonthView({
            width        : 1000,
            height       : 750,
            date         : new Date(2011, 0, 1),
            weekStartDay : 3,
            eventStore
        });

        // eslint-disable-next-line no-unused-vars
        const eventElements = monthView.bodyElement.querySelectorAll('.b-cal-event-wrap:not(.b-overflow)');

        t.isDeeply(monthView.weekdayCells.map(w => w.innerHTML), ['Wed', 'Thu', 'Fri', 'Sat', 'Sun', 'Mon', 'Tue']);

        t.is(monthView.getCell('2010-12-29').querySelector('.b-cal-event-wrap').offsetWidth, monthView.weekDayElements[0].offsetWidth, 'Top row correct width');
        t.isApprox(monthView.getCell('2011-01-05').querySelector('.b-cal-event-wrap').getBoundingClientRect().width, monthView.weekDayElements[0].offsetWidth / 7 * 5, 0.5, 'Second row correct width');

        t.is(monthView.getCell('2010-12-29').innerText.replace(trimNewLines, ''), '129Assignment 1'); // Week 1
        t.is(monthView.getCell('2010-12-30').innerText.replace(trimNewLines, ''), '30Assignment 1');
        t.is(monthView.getCell('2010-12-31').innerText.replace(trimNewLines, ''), '31Assignment 1');
        t.is(monthView.getCell('2011-01-01').innerText.replace(trimNewLines, ''), '1Assignment 1');
        t.is(monthView.getCell('2011-01-02').innerText.replace(trimNewLines, ''), '2Assignment 1');
        t.is(monthView.getCell('2011-01-03').innerText.replace(trimNewLines, ''), '3Assignment 1');
        t.is(monthView.getCell('2011-01-04').innerText.replace(trimNewLines, ''), '4Assignment 1');
        t.is(monthView.getCell('2011-01-05').innerText.replace(trimNewLines, ''), '25Assignment 1'); // Week 2
        t.is(monthView.getCell('2011-01-06').innerText.replace(trimNewLines, ''), '6Assignment 1');
        t.is(monthView.getCell('2011-01-07').innerText.replace(trimNewLines, ''), '7Assignment 1');
        t.is(monthView.getCell('2011-01-08').innerText.replace(trimNewLines, ''), '8Assignment 1');
        t.is(monthView.getCell('2011-01-09').innerText.replace(trimNewLines, ''), '9Assignment 1');
    });

    t.it('hideNonworkingDays', async t => {
        const eventStore = t.getEventStore({
            data : [{
                id         : 'longEvent',
                cls        : 'event1',
                resourceId : 'r1',
                name       : 'Assignment 1',
                startDate  : new Date(2010, 11, 25),
                endDate    : new Date(2011, 0, 10)
            }]
        });

        monthView = await getMonthView({
            width              : 1000,
            height             : 750,
            date               : new Date(2011, 0, 1),
            hideNonWorkingDays : true,
            eventStore
        });

        // eslint-disable-next-line no-unused-vars
        const eventElements = monthView.bodyElement.querySelectorAll('.b-cal-event-wrap:not(.b-overflow)');

        t.isDeeply(monthView.weekdayCells.reduce((prev, w) => {
            if (DomHelper.getStyleValue(w, 'display') !== 'none') {
                prev.push(w.innerHTML);
            }
            return prev;
        }, []), ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']);

        t.is(monthView.getCell('2010-12-27').querySelector('.b-cal-event-wrap').offsetWidth, monthView.weekDayElements[0].offsetWidth, 'Top row correct width');
        t.is(monthView.getCell('2011-01-03').querySelector('.b-cal-event-wrap').offsetWidth, monthView.weekDayElements[0].offsetWidth, 'Second row correct width');

        t.is(monthView.getCell('2010-12-27').innerText.replace(trimNewLines, ''), '5227Assignment 1'); // Week 52
        t.is(monthView.getCell('2010-12-28').innerText.replace(trimNewLines, ''), '28Assignment 1');
        t.is(monthView.getCell('2010-12-29').innerText.replace(trimNewLines, ''), '29Assignment 1');
        t.is(monthView.getCell('2010-12-30').innerText.replace(trimNewLines, ''), '30Assignment 1');
        t.is(monthView.getCell('2010-12-31').innerText.replace(trimNewLines, ''), '31Assignment 1');
        t.is(monthView.getCell('2011-01-03').innerText.replace(trimNewLines, ''), '13Assignment 1'); // Week 1
        t.is(monthView.getCell('2011-01-04').innerText.replace(trimNewLines, ''), '4Assignment 1');
        t.is(monthView.getCell('2011-01-05').innerText.replace(trimNewLines, ''), '5Assignment 1');
        t.is(monthView.getCell('2011-01-06').innerText.replace(trimNewLines, ''), '6Assignment 1');
        t.is(monthView.getCell('2011-01-07').innerText.replace(trimNewLines, ''), '7Assignment 1');
    });

    t.it('hideNonworkingDays with a renderer that sets a day to nonWorking', async t => {
        const eventStore = t.getEventStore({
            data : [{
                id         : 'longEvent',
                cls        : 'event1',
                resourceId : 'r1',
                name       : 'Assignment 1',
                startDate  : new Date(2010, 11, 25),
                endDate    : new Date(2011, 0, 10)
            }]
        });

        monthView = await getMonthView({
            width              : 1000,
            height             : 750,
            date               : new Date(2011, 0, 1),
            hideNonWorkingDays : true,
            eventStore,
            dayCellRenderer    : function(cellData) {
                if (!(cellData.date - new Date(2011, 0, 3))) {
                    cellData.cls['new-years-day'] = true;

                    cellData.headerStyle.textDecoration = 'underline';

                    // Mutate day cell information
                    cellData.isNonWorking = true;

                    return `${cellData.date.getDate()} Bank Hol!`;
                }
            }
        });

        // eslint-disable-next-line no-unused-vars
        const eventElements = monthView.bodyElement.querySelectorAll('.b-cal-event-wrap:not(.b-overflow)');

        t.isDeeply(monthView.weekdayCells.reduce((prev, w) => {
            if (DomHelper.getStyleValue(w, 'display') !== 'none') {
                prev.push(w.innerHTML);
            }
            return prev;
        }, []), ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']);

        t.is(monthView.getCell('2011-01-03').querySelector('.b-cal-cell-header').style.textDecoration, 'underline', 'dayCellRenderer headerStyle works');

        t.is(monthView.getCell('2010-12-27').querySelector('.b-cal-event-wrap').offsetWidth, monthView.weekDayElements[0].offsetWidth, 'Top row correct width');
        t.is(monthView.getCell('2011-01-03').querySelector('.b-cal-event-wrap').offsetWidth, monthView.weekDayElements[0].offsetWidth, 'Second row correct width');

        t.is(monthView.getCell('2010-12-27').innerText.replace(trimNewLines, ''), '5227Assignment 1'); // Week 52
        t.is(monthView.getCell('2010-12-28').innerText.replace(trimNewLines, ''), '28Assignment 1');
        t.is(monthView.getCell('2010-12-29').innerText.replace(trimNewLines, ''), '29Assignment 1');
        t.is(monthView.getCell('2010-12-30').innerText.replace(trimNewLines, ''), '30Assignment 1');
        t.is(monthView.getCell('2010-12-31').innerText.replace(trimNewLines, ''), '31Assignment 1');
        t.is(monthView.getCell('2011-01-03').innerText.replace(trimNewLines, ''), '13 Bank Hol!Assignment 1'); // Week 1
        t.is(monthView.getCell('2011-01-04').innerText.replace(trimNewLines, ''), '4Assignment 1');
        t.is(monthView.getCell('2011-01-05').innerText.replace(trimNewLines, ''), '5Assignment 1');
        t.is(monthView.getCell('2011-01-06').innerText.replace(trimNewLines, ''), '6Assignment 1');
        t.is(monthView.getCell('2011-01-07').innerText.replace(trimNewLines, ''), '7Assignment 1');
    });

    t.it('Events at visible limits', async t => {
        const eventStore = t.getEventStore({
            data : [{
                id         : 'e1',
                cls        : 'cell-0',
                resourceId : 'r1',
                name       : 'Cell 0',
                startDate  : new Date(2010, 11, 26),
                endDate    : new Date(2010, 11, 27)
            }, {
                id         : 'e2',
                cls        : 'cell-35',
                resourceId : 'r1',
                name       : 'Cell 35',
                startDate  : new Date(2011, 1, 5),
                endDate    : new Date(2011, 1, 6)
            }]
        });

        monthView = await getMonthView({
            width  : 1000,
            height : 750,
            date   : new Date(2011, 0, 1),
            eventStore
        });

        const eventElements = monthView.bodyElement.querySelectorAll('.b-cal-event-wrap');

        t.is(eventElements.length, 2, '2 event start elements');

        // We should only have gathered cells for the view's own cells
        t.is(monthView.cellMap.size, 2);

        // other month indicator shows whether it's past or future
        t.is(monthView.cellMap.get('2010-12-26').isOtherMonth, -1);
        t.is(monthView.cellMap.get('2011-02-05').isOtherMonth, 1);
    });

    t.it('Recurring events', async t => {
        const eventStore = t.getEventStore({
            data : [{
                id             : 1,
                cls            : 'b-scrum',
                resourceId     : 'r1',
                name           : 'Tuesday/Thursday scrum',
                startDate      : new Date(2011, 0, 4, 9),
                endDate        : new Date(2011, 0, 4, 10),
                recurrenceRule : 'FREQ=WEEKLY;BYDAY=TU,TH'
            }]
        });

        resourceStore = t.getResourceStore({
            data : [
                { id : 'r1', name : 'Meeting room 1',  eventColor : '#ff0000' }
            ]
        });

        monthView = await getMonthView({
            width  : 1000,
            height : 750,
            date   : new Date(2011, 0, 1),
            eventStore,
            resourceStore
        });

        const eventEls = monthView.contentElement.querySelectorAll('.b-cal-event');

        t.is(eventEls.length, 10, 'Correct number of rendered Events');

        eventEls.forEach(e => {
            const { color } = e.style;

            t.is(e.textContent, 'Tuesday/Thursday scrum');
            t.ok(color === 'rgb(255, 0, 0)' || color === '#ff0000', 'Correct color');
        });
    });

    t.it('Generates occurrences for events which are promoted to be recurring', async t => {
        const
            eventStore = t.getEventStore({
                data : [{
                    id         : 1,
                    cls        : 'b-scrum',
                    resourceId : 'r1',
                    name       : 'Tuesday/Thursday scrum',
                    startDate  : new Date(2011, 0, 4, 9),
                    endDate    : new Date(2011, 0, 4, 10)
                }]
            }),
            event = eventStore.first;

        resourceStore = t.getResourceStore({
            data : [
                { id : 'r1', name : 'Meeting room 1',  eventColor : '#ff0000' }
            ]
        });

        monthView = await getMonthView({
            width  : 1000,
            height : 750,
            date   : new Date(2011, 0, 1),
            eventStore,
            resourceStore
        });

        let eventEls = monthView.contentElement.querySelectorAll('.b-cal-event');

        t.is(eventEls.length, 1, 'Correct number of rendered Events');

        event.recurrenceRule = 'FREQ=WEEKLY;BYDAY=TU,TH';

        await t.waitForEvent(monthView, 'refresh');

        eventEls = monthView.contentElement.querySelectorAll('.b-cal-event');

        t.is(eventEls.length, 10, 'Correct number of rendered Events');

        eventEls.forEach(e => {
            const { color } = e.style;

            t.is(e.textContent, 'Tuesday/Thursday scrum');
            t.ok(color === 'rgb(255, 0, 0)' || color === '#ff0000');
        });

        const exceptionEvent = event.occurrences[4];

        exceptionEvent.set({
            name           : 'Exception',
            startDate      : new Date(2011, 0, 19),
            endDate        : new Date(2011, 0, 20),
            recurrenceRule : ''
        });

        exceptionEvent.recurrenceRule = 'FREQ=WEEKLY';

        await t.waitForEvent(monthView, 'refresh');

        eventEls = monthView.contentElement.querySelectorAll('.b-cal-event');

        t.is(eventEls.length, 12, 'Correct number of rendered Events');
    });

    t.it('minRowHeight', async t => {
        monthView = await getMonthView({
            id          : 'test-min-row-height',
            date        : '2018-01-01',
            height      : 400,
            width       : 800,
            eventHeight : 20
        });

        t.notOk(monthView.scrollable, 'MonthView is not scrollable');

        t.is(monthView.eventsPerCell, 1, 'Only space for 1 event per cell');

        monthView.minRowHeight = 110;

        t.is(monthView.scrollable.overflowY, 'auto', 'MonthView is scrollable in Y axis');

        t.is(monthView.eventsPerCell, 3, 'Now there\'s space for 3 events per cell');
    });

    t.it('autoRowHeight', async t => {
        monthView = await getMonthView({
            events      : t.getHackathonData().events.rows,
            resources   : t.getHackathonData().resources.rows,
            sidebar     : false,
            date        : new Date(2019, 9, 14),
            height      : 768,
            width       : 800,
            eventHeight : 20
        });

        const
            { eventsPerCell } = monthView,
            eventBarCount     = monthView.contentElement.querySelectorAll('.b-cal-event-wrap').length;

        monthView.autoRowHeight = true;

        await t.waitForAnimations();

        monthView.minRowHeight = 50;

        await t.waitForAnimations();

        // It's reduced the events per cell
        t.isLess(monthView.eventsPerCell, eventsPerCell);

        // But because we are autoRowHeight : true, the eventsPerCell is not consulted
        // and all events are accommodated
        t.isGreater(monthView.contentElement.querySelectorAll('.b-cal-event-wrap').length, eventBarCount);

        monthView.autoRowHeight = false;

        await t.waitForAnimations();

        // Returned to initial state
        t.is(monthView.eventsPerCell, eventsPerCell);
        t.is(monthView.contentElement.querySelectorAll('.b-cal-event-wrap').length, eventBarCount);
    });

    t.it('eventRenderer setting cls and style values', async t => {
        const eventStore = t.getEventStore({
            data : [{
                id         : 1,
                cls        : 'cls-from-data',
                iconCls    : 'icon-cls-from-data',
                resourceId : '1',
                name       : 'Assignment 1',
                startDate  : new Date(2011, 0, 3, 9),
                endDate    : new Date(2011, 0, 3, 10),
                style      : 'font-weight : 400'
            }]
        });

        resourceStore = t.getResourceStore({
            data : [
                { id : 'r1', name : 'Mike',  eventColor : 'red' }
            ]
        });

        monthView = await getMonthView({
            width  : 1000,
            height : 750,
            date   : new Date(2011, 0, 1),
            eventStore,
            resourceStore,
            eventRenderer({ renderData }) {

                // Our renderer classes *override* the existing classes specified in the data
                renderData.cls = 'my-cls';
                renderData.iconCls = 'b-fa b-fa-coffee';
                renderData.style = 'font-weight : 200';
                return 'Renderer';
            }
        });

        const el = monthView.getEventElement(eventStore.first);

        t.ok(el.querySelector('.b-cal-event-icon.b-fa.b-fa-coffee:not(.icon-cls-from-data)'), 'Icon class applied, overrides data iconCls');
        t.is(el.querySelector('.b-cal-event-desc').innerText, 'Renderer', 'Renderer applied');
        t.hasCls(el, 'my-cls', 'Renderer cls applied');
        t.hasNotCls(el, 'cls-from-data', 'Data cls was overridden by the renderer');
        t.is(el.style.fontWeight, '200', 'Font weight correctly overridden');
    });

    t.it('eventRenderer mutating cls and style values', async t => {
        const eventStore = t.getEventStore({
            data : [{
                id         : 1,
                cls        : 'cls-from-data',
                iconCls    : 'icon-cls-from-data',
                resourceId : '1',
                name       : 'Assignment 1',
                startDate  : new Date(2011, 0, 3, 9),
                endDate    : new Date(2011, 0, 3, 10),
                style      : 'font-weight : 400'
            }]
        });

        resourceStore = t.getResourceStore({
            data : [
                { id : 'r1', name : 'Mike',  eventColor : 'red' }
            ]
        });

        monthView = await getMonthView({
            width  : 1000,
            height : 750,
            date   : new Date(2011, 0, 1),
            eventStore,
            resourceStore,
            eventRenderer({ renderData }) {

                // Our renderer classes get *added* to the existing classes specified in the data
                renderData.cls.add('my-cls');
                renderData.iconCls.add('b-fa b-fa-coffee');
                renderData.style.textDecoration = 'underline';
                return 'Renderer';
            }
        });

        const el = monthView.getEventElement(eventStore.first);

        t.ok(el.querySelector('.b-cal-event-icon.icon-cls-from-data.b-fa.b-fa-coffee'), 'Icon class applied, added to data iconCls');
        t.is(el.querySelector('.b-cal-event-desc').innerText, 'Renderer', 'Renderer applied');
        t.hasCls(el, 'my-cls', 'Renderer cls added');
        t.hasCls(el, 'cls-from-data', 'Data cls remains');
        t.is(el.style.fontWeight, '400', 'Data font weight correctly remains');
        t.is(el.style.textDecoration, 'underline', 'Renderer style correctly added');
    });

    t.it('dayCellRenderer should be able to affect cell style', async t => {
        const
            eventStore = t.getEventStore({
                data : []
            }),
            colours = [
                ['rgb(255, 0, 0)', 'red'],
                ['rgb(255, 165, 0)', 'orange'],
                ['rgb(255, 255, 0)', 'yellow'],
                ['rgb(0, 128, 0)', 'green'],
                ['rgb(0, 0, 255)', 'blue'],
                ['rgb(75, 0, 130)', 'violet'],
                ['rgb(238, 130, 238)', 'pink']
            ];

        let setColour = true;

        monthView = await getMonthView({
            width           : 1000,
            height          : 750,
            date            : new Date(2011, 0, 1),
            eventStore,
            dayCellRenderer : function(cellData) {
                if (setColour) {
                    cellData.cls[`b-color-${colours[cellData.columnIndex][1]}`] = 1;
                    cellData.style.backgroundColor = colours[cellData.columnIndex][0];
                }
            }
        });
        const mEl = monthView.element;

        // First refresh should have applied cell styles, different for each day of the week
        for (let columnIndex = 0; columnIndex < 7; columnIndex++) {
            const cells = mEl.querySelectorAll(`.b-calendar-cell[data-column-index="${columnIndex}"]`);

            cells.forEach((cell, cellIndex) => {
                t.hasStyle(
                    cell,
                    'backgroundColor',
                    colours[columnIndex][0],
                    'background-color is ' + colours[columnIndex][1] + ' for ' + cellIndex + ' cell in ' + columnIndex + ' column'
                );
                t.hasCls(cell, `b-color-${colours[columnIndex][1]}`, `Class has b-color-${colours[columnIndex][1]}`);
            });
        }

        // This must not lose the renderer class names.
        monthView.doRefresh();

        // Conditions still exactly the same
        for (let columnIndex = 0; columnIndex < 7; columnIndex++) {
            const cells = mEl.querySelectorAll(`.b-calendar-cell[data-column-index="${columnIndex}"]`);

            cells.forEach((cell, cellIndex) => {
                t.hasStyle(
                    cell,
                    'backgroundColor',
                    colours[columnIndex][0],
                    'background-color is ' + colours[columnIndex][1] + ' for ' + cellIndex + ' cell in ' + columnIndex + ' column'
                );
                t.hasCls(cell, `b-color-${colours[columnIndex][1]}`, `Class has b-color-${colours[columnIndex][1]}`);
            });
        }

        // In the next refresh, the styles must be cleansed of previous rendering.
        setColour = false;

        monthView.refresh();

        // Style must be cleared now
        for (let columnIndex = 0; columnIndex < 7; columnIndex++) {
            const cells = mEl.querySelectorAll(`[data-column-index="${columnIndex}"]`);

            cells.forEach((cell, cellIndex) => {
                t.is(cell.style.backgroundColor, '', 'background style is reset for ' + cellIndex + ' cell in ' + columnIndex + ' column');
                t.hasNotCls(cell, `b-color-${colours[columnIndex][1]}`, `Class does not have b-color-${colours[columnIndex][1]}`);
            });
        }
    });

    t.it('dayCellRenderer result should be used as HTML', async t => {
        calendar = await t.getCalendar({
            events    : t.getHackathonData().events.rows,
            resources : t.getHackathonData().resources.rows,
            sidebar   : false,
            date      : new Date(2019, 9, 14),
            mode      : 'month',
            modes     : {
                month : {
                    dayCellRenderer : function(cellData) {
                        return `<b class="my-month-day-name">${cellData.date.getDate()}</b>`;
                    }
                }
            }
        });

        t.selectorCountIs('b.my-month-day-name', 42);
    });

    t.it('interday events should sort to the top', async t => {
        const eventStore = t.getEventStore({
            data : [{
                id         : 'event1',
                cls        : 'event1',
                resourceId : 'r1',
                name       : 'Assignment 1',
                color      : 'red',
                startDate  : new Date(2011, 0, 10, 8),
                endDate    : new Date(2011, 0, 10, 9)
            }, {
                id         : 'event2',
                cls        : 'event2',
                resourceId : 'r1',
                name       : 'Assignment 2',
                color      : '#f1c114',
                startDate  : new Date(2011, 0, 10, 8),
                endDate    : new Date(2011, 0, 10, 9)
            }, {
                id         : 'event3',
                cls        : 'event3',
                resourceId : 'r1',
                name       : 'Assignment 3',
                color      : 'green',
                startDate  : new Date(2011, 0, 10, 12),
                endDate    : new Date(2011, 0, 11, 9)
            }, {
                id         : 'event4',
                cls        : 'event4',
                resourceId : 'r1',
                name       : 'Assignment 4',
                color      : 'blue',
                startDate  : new Date(2011, 0, 10, 12),
                endDate    : new Date(2011, 0, 11, 9)
            }, {
                id         : 'event5',
                cls        : 'event5',
                resourceId : 'r1',
                name       : 'Assignment 5',
                color      : 'indigo',
                startDate  : new Date(2011, 0, 10, 12),
                endDate    : new Date(2011, 0, 11, 9)
            }]
        });

        monthView = await getMonthView({
            width  : 1024,
            height : 678,
            date   : new Date(2011, 0, 1),
            eventStore
        });

        t.firesOnce(monthView, 'cellOverflowClick', 'Overflow indicator clicked only once');

        t.selectorCountIs('.b-cal-event-wrap.b-allday:not(.b-overflow)', 2);
        t.selectorCountIs('.b-cal-event-wrap:not(.b-allday)', 0);

        // The 10th has three overflows
        t.selectorCountIs('.b-cal-cell-overflow:contains(+3 more)', 1);

        // The 11th does not itself overflow, but because the previous cell has an overflow
        // indicator, it cannot show a bar down there. It has to match, so this is the *ONLY*
        // case where we ever show a "+1 more" indicator.
        // We show "+2 more" at least because an overflow indicator is the same height as an event bar.
        t.selectorCountIs('.b-cal-cell-overflow:contains(+1 more)', 1);

        await t.click('.b-cal-cell-overflow:contains(+3 more)');

        await t.selectorExists('.b-overflowpopup');

        const eventEls = monthView.overflowPopup.element.querySelectorAll('.b-cal-event-wrap');

        // Order must be correct. Interday events all gone to top.
        t.is(eventEls[0].innerText.trim(), 'Assignment 3');
        t.is(eventEls[1].innerText.trim(), 'Assignment 4');
        t.is(eventEls[2].innerText.trim(), 'Assignment 5');
        t.is(eventEls[3].innerText.trim(), 'Assignment 1');
        t.is(eventEls[4].innerText.trim(), 'Assignment 2');
    });

    t.it('should show the correct number of overflow events even when extremely small height', async t => {
        const eventStore = t.getEventStore({
            data : [{
                id         : 'event1',
                cls        : 'event1',
                resourceId : 'r1',
                name       : 'Assignment 1',
                color      : 'red',
                startDate  : new Date(2011, 0, 10, 8),
                endDate    : new Date(2011, 0, 10, 9)
            }, {
                id         : 'event2',
                cls        : 'event2',
                resourceId : 'r1',
                name       : 'Assignment 2',
                color      : '#f1c114',
                startDate  : new Date(2011, 0, 10, 8),
                endDate    : new Date(2011, 0, 10, 9)
            }, {
                id         : 'event3',
                cls        : 'event3',
                resourceId : 'r1',
                name       : 'Assignment 3',
                color      : 'green',
                startDate  : new Date(2011, 0, 10, 12),
                endDate    : new Date(2011, 0, 11, 9)
            }, {
                id         : 'event4',
                cls        : 'event4',
                resourceId : 'r1',
                name       : 'Assignment 4',
                color      : 'blue',
                startDate  : new Date(2011, 0, 10, 12),
                endDate    : new Date(2011, 0, 11, 9)
            }, {
                id         : 'event5',
                cls        : 'event5',
                resourceId : 'r1',
                name       : 'Assignment 5',
                color      : 'indigo',
                startDate  : new Date(2011, 0, 10, 12),
                endDate    : new Date(2011, 0, 11, 9)
            }]
        });

        monthView = await getMonthView({
            width  : 1024,
            // 350 breaks it but at 400 the rendering is correct (https://github.com/bryntum/support/issues/1454)
            height : 350,
            date   : new Date(2011, 0, 1),
            eventStore
        });

        // The 10th has 5 overflows
        t.selectorCountIs('.b-cal-cell-overflow:contains(+5 more)', 1);

        // The 11th has 3 overflows
        t.selectorCountIs('.b-cal-cell-overflow:contains(+3 more)', 1);
    });

    t.it('Week row sizing', async t => {
        const eventStore = t.getEventStore({
            data : [{
                id         : 'event1',
                cls        : 'event1',
                resourceId : 'r1',
                name       : 'Assignment 1',
                color      : 'red',
                startDate  : new Date(2011, 0, 10),
                endDate    : new Date(2011, 0, 10)
            }, {
                id         : 'event2',
                cls        : 'event2',
                resourceId : 'r1',
                name       : 'Assignment 2',
                color      : '#f1c114',
                startDate  : new Date(2011, 0, 10),
                endDate    : new Date(2011, 0, 10)
            }, {
                id         : 'event3',
                cls        : 'event3',
                resourceId : 'r1',
                name       : 'Assignment 3',
                color      : 'green',
                startDate  : new Date(2011, 0, 10),
                endDate    : new Date(2011, 0, 10)
            }, {
                id         : 'event4',
                cls        : 'event4',
                resourceId : 'r1',
                name       : 'Assignment 4',
                color      : 'blue',
                startDate  : new Date(2011, 0, 10),
                endDate    : new Date(2011, 0, 10)
            }, {
                id         : 'event5',
                cls        : 'event5',
                resourceId : 'r1',
                name       : 'Assignment 5',
                color      : 'indigo',
                startDate  : new Date(2011, 0, 10),
                endDate    : new Date(2011, 0, 10)
            }]
        });

        let flexedElement,
            flexedWeekStart,
            shrinkWrappedElement,
            shrinkWrappedWeekStart;

        monthView = await getMonthView({
            width               : 1000,
            // Start small because we are testing overflow
            height              : 500,
            date                : new Date(2011, 0, 1),
            eventHeight         : 18,
            eventStore,
            overflowClickAction : 'shrinkwrap',
            listeners           : {
                weekFlex({ weekStart, element }) {
                    flexedElement = element;
                    flexedWeekStart = weekStart;
                },
                weekShrinkwrap({ weekStart, element }) {
                    shrinkWrappedElement = element;
                    shrinkWrappedWeekStart = weekStart;
                }
            }
        });

        const
            weekStartDate = new Date(2011, 0, 9),
            weekRow       = monthView.weekElements[2],
            flexedHeight  = weekRow.offsetHeight;

        t.is(parseInt(DomHelper.getStyleValue(weekRow, 'flex-grow')), 1, 'Test week row flex-grow is 1');
        t.is(parseInt(DomHelper.getStyleValue(weekRow, 'flex-shrink')), 0, 'Test week row flex-shrink is 0');
        t.is(parseInt(DomHelper.getStyleValue(weekRow, 'flex-basis')), 0, 'Test week row flex-basis is 0');

        await t.click('.b-cal-cell-overflow');

        // Row animates to new height.
        // Sets the Widget isAnimating state which Siesta knows how to wait for.
        await t.waitForAnimations();

        // weekShrinkwrap event was fired correctly
        t.is(shrinkWrappedElement, weekRow, 'Event received correct element');
        t.is(shrinkWrappedWeekStart, weekStartDate, 'Event received correct date');

        t.is(parseInt(DomHelper.getStyleValue(weekRow, 'flex-grow')), 0, 'Test week row flex-grow is 0');
        t.is(parseInt(DomHelper.getStyleValue(weekRow, 'flex-shrink')), 0, 'Test week row flex-shrink is 0');
        t.isApprox(parseInt(DomHelper.getStyleValue(weekRow, 'flex-basis')), 128, 1, 'Test week row flex-basis is 128');

        // Week has expanded
        t.isApprox(weekRow.offsetHeight, 128, 'Expanded height correct');
        t.isGreater(weekRow.offsetHeight, flexedHeight, 'Expanded height is greater than flexed height');

        // It's scrollable in the Y axis
        t.ok(monthView.scrollable.maxY, 'MonthView has vertical scroll');

        // There's no overflow indicator
        t.selectorNotExists('.b-cal-cell-overflow', 'No visible overflow indicator');

        // Set it back to a flexed height
        monthView.flexWeekRow(2);

        // Row animates to new height.
        // Sets the Widget isAnimating state which Siesta knows how to wait for.
        await t.waitForAnimations();

        // weekFlex event was fired correctly
        t.is(flexedElement, weekRow, 'Event received correct element');
        t.is(flexedWeekStart, weekStartDate, 'Event received correct date');

        // Week has shrunk back
        t.is(parseInt(DomHelper.getStyleValue(weekRow, 'flex-grow')), 1, 'Test week row flex-grow is 1');
        t.is(parseInt(DomHelper.getStyleValue(weekRow, 'flex-shrink')), 0, 'Test week row flex-shrink is 0');
        t.is(parseInt(DomHelper.getStyleValue(weekRow, 'flex-basis')), 0, 'Test week row flex-basis is 0');
        t.is(weekRow.offsetHeight, flexedHeight, 'Collapsed height correct');

        // It's not scrollable in the Y axis
        t.notOk(monthView.scrollable.maxY, 'MonthView has vertical scroll');

        // There's an overflow indicator
        t.selectorExists('.b-cal-cell-overflow', 'There\'s an overflow indicator');
    });

    t.it('eventHeight', async t => {
        monthView = await getMonthView({
            height     : 768,
            width      : 1024,
            eventStore : t.getEventStore({
                data : [{
                    id         : 'e1',
                    cls        : 'event1',
                    resourceId : 'r1',
                    name       : 'Event 1',
                    startDate  : new Date(2011, 1, 24, 9),
                    endDate    : new Date(2011, 1, 24, 10)
                }, {
                    id         : 'e2',
                    cls        : 'event2',
                    resourceId : 'r2',
                    name       : 'Event 2',
                    startDate  : new Date(2011, 1, 24, 10),
                    endDate    : new Date(2011, 1, 24, 11)
                }]
            }),
            date : new Date(2011, 1, 24)
        });

        const
            e1Element     = monthView.getEventElement(eventStore.first).querySelector('.b-cal-event'),
            e2Element     = monthView.getEventElement(eventStore.getAt(1)).querySelector('.b-cal-event'),
            defaultHeight = DomHelper.setLength(monthView.eventHeight);

        // Event elements are obeying the eventHeight, and not overlapping each other
        t.is(e1Element.style.height, defaultHeight);
        t.is(e2Element.style.height, defaultHeight);
        t.notOk(Rectangle.from(e1Element).intersect(Rectangle.from(e2Element)));

        // Make event heights use a string based height using CSS units
        monthView.eventHeight = '3em';

        // Await the *next* refresh event
        await monthView.await('refresh', { checklog : false });

        // Event elements are obeying the eventHeight, and not overlapping each other
        t.is(e1Element.style.height, '3em');
        t.is(e2Element.style.height, '3em');
        t.notOk(Rectangle.from(e1Element).intersect(Rectangle.from(e2Element)));
    });

    t.it('renders monthly recurring events on specified weekday', async t => {
        // See https://github.com/bryntum/support/issues/3413
        const eventStore = t.getEventStore({
            data : [{
                id             : 1,
                name           : 'Every 2nd Wed',
                iconCls        : 'b-fa-coffee',
                resourceId     : '1',
                startDate      : new Date(2021, 8, 3, 9, 4),
                duration       : 1,
                durationUnit   : 'h',
                recurrenceRule : 'FREQ=MONTHLY;INTERVAL=1;BYDAY=WE;BYSETPOS=2'
            }]
        });

        resourceStore = t.getResourceStore({
            data : [
                { id : 'r1', name : 'Mike', eventColor : 'red' }
            ]
        });

        calendar = await t.getCalendar({
            eventStore,
            resourceStore,
            date    : new Date(2021, 10, 1),
            sidebar : false,
            modes   : {
                agenda : null,
                year   : null,
                week   : null,
                day    : null,
                month  : true
            }
        });

        await t.waitForSelector('[data-date="2021-11-10"] .b-fa-coffee');
        await t.waitForSelector('[data-date="2021-12-08"] .b-fa-coffee');

        t.selectorCountIs('.b-fa-coffee:visible', 2, 'Correct number of events rendered');

        await t.doubleClick('.b-calendar-cell[data-date="2021-11-02"]');
        await t.click('.b-eventeditor .b-textfield[data-ref="nameField"] input');
        await t.type(null, 'Every 1st Tuesday');

        await t.click('.b-recurrencefrequencycombo input');
        await t.click('.b-list.b-floating [data-id="MONTHLY"]');

        await t.click('.b-recurrencelegendbutton');

        await t.click('.b-recurrenceeditor .b-checkbox[data-ref="monthDaysRadioField"] input');
        await t.click('.b-recurrenceeditor .b-checkbox[data-ref="positionAndDayRadioField"] input');

        await t.click('.b-recurrencepositionscombo input');
        await t.click('.b-list.b-floating [data-index="0"]');  // click first item in list (not by id, that was the bug)

        await t.click('.b-recurrencedayscombo input');
        await t.click('.b-list.b-floating [data-id="TU"]');

        await t.click('.b-recurrenceeditor [data-ref="saveButton"]');

        await t.waitForSelector('.b-recurrencelegendbutton:contains("Monthly on the first Tuesday")');
        await t.click('.b-eventeditor [data-ref="saveButton"]');

        await t.waitForSelector('[data-date="2021-11-02"]:contains("Every 1st Tuesday")');
        await t.waitForSelector('[data-date="2021-12-07"]:contains("Every 1st Tuesday")');
        t.selectorCountIs('.b-cal-event:contains("Every 1st Tuesday"):visible', 2, 'Correct number of events rendered');
    });

    t.it('autoCreate in MonthView', async t => {
        eventStore = new EventStore({
            data              : [],
            defaultCalendarId : 'r2'
        });

        resourceStore = new ResourceStore({
            data : [{
                id   : 'r1',
                name : 'Calendar 1'
            }, {
                id   : 'r2',
                name : 'Calendar 2'
            }]
        });

        calendar = await t.getCalendar({
            date     : new Date(2019, 9, 7),
            eventStore,
            resourceStore,
            sidebar  : false,
            features : {
                eventTooltip : false,
                eventEdit    : false
            },
            modes : {
                agenda : null,
                year   : null,
                week   : null,
                day    : null,
                month  : true
            }
        });
        t.selectorCountIs('.b-cal-event-wrap', 0, 'No events');

        t.chain(
            { dblclick : '.b-calendar-cell[data-date="2019-10-07"]' },

            { waitForSelector : '.b-cal-event-wrap' },

            next => {
                t.is(calendar.eventStore.count, 1);
                t.selectorCountIs('.b-cal-event-wrap', 1, '1 event');

                const newEvent = calendar.eventStore.first;

                t.is(newEvent.startDate, new Date(2019, 9, 7, 8), 'Correct start date');
                t.is(newEvent.endDate, new Date(2019, 9, 7, 9), 'Correct end date');
                t.is(newEvent.resource, calendar.resourceStore.getAt(1), 'Correct resource');

                calendar.autoCreate = false;
                next();
            },

            { dblclick : '.b-calendar-cell[data-date="2019-10-08"]' },

            next => {
                t.is(calendar.eventStore.count, 1, 'Still one event, autoCreate disabled');
                t.selectorCountIs('.b-cal-event-wrap', 1, 'Still one event, autoCreate disabled');

                calendar.autoCreate = 'click';
                next();
            },

            // Step over the click block time
            { waitFor : 500 },

            { click : '.b-calendar-cell[data-date="2019-10-08"]' },

            { waitFor : () => calendar.activeView.element.querySelectorAll('.b-cal-event-wrap').length === 2 },

            () => {
                t.is(calendar.eventStore.count, 2);
                t.selectorCountIs('.b-cal-event-wrap', 2, 'Two events');

                const newEvent = calendar.eventStore.getAt(1);

                t.is(newEvent.startDate, new Date(2019, 9, 8, 8), 'Correct start date');
                t.is(newEvent.endDate, new Date(2019, 9, 8, 9), 'Correct end date');
                t.is(newEvent.resource, calendar.resourceStore.getAt(1), 'Correct resource');
            }
        );
    });

    t.it('Should switch to month view upon click of a year\'s month name header', async t => {
        eventStore = new EventStore({
            data : t.getHackathonData().events.rows
        });

        const eventRec = eventStore.getById(3);

        eventRec.iconCls = 'b-fa-cog';

        resourceStore = new ResourceStore({
            data : t.getHackathonData().resources.rows
        });

        calendar = await t.getCalendar({
            eventStore,
            resourceStore,
            sidebar : false,
            date    : new Date(2019, 9, 14),
            mode    : 'year'
        });

        // Month view has not been refreshed yet - it's not painted.
        t.selectorNotExists('.b-cal-event-wrap.b-allday.b-past-event.b-continues-right:contains(Hackathon 2019)',
            'Month view not shown');

        const eventWait = t.waitForEvent(calendar.widgetMap.viewContainer, 'activeitemchange');

        await t.click('.b-yearview-month-name:contains(October)');
        await eventWait;

        // Now we must be seeing the hackathon month
        t.selectorExists('.b-cal-event-wrap.b-allday.b-past-event.b-continues-right:contains(Hackathon 2019)',
            'Month view shown');

        t.selectorCountIs('.b-cal-event-icon', 13, 'All icons rendered');
        t.selectorCountIs('.b-cal-event-icon:visible', 2, 'Only custom icons are visible');
        t.selectorCountIs('.b-cal-recurrence-icon:visible', 3, 'All recurrence icons are visible');
    });

    t.it('overflowButtonRenderer as function', async t => {
        eventStore = t.getEventStore({
            data : [{
                id         : 'event1',
                cls        : 'event1',
                resourceId : 'r1',
                name       : 'Assignment 1',
                color      : 'red',
                startDate  : new Date(2011, 0, 10, 9),
                endDate    : new Date(2011, 0, 10, 10)
            }, {
                id         : 'event2',
                cls        : 'event2',
                resourceId : 'r1',
                name       : 'Assignment 2',
                color      : '#f1c114',
                startDate  : new Date(2011, 0, 10, 10),
                endDate    : new Date(2011, 0, 10, 11)
            }, {
                id         : 'event3',
                cls        : 'event3',
                resourceId : 'r1',
                name       : 'Assignment 3',
                color      : 'green',
                startDate  : new Date(2011, 0, 10, 11),
                endDate    : new Date(2011, 0, 10, 12)
            }, {
                id         : 'event4',
                cls        : 'event4',
                resourceId : 'r1',
                name       : 'Assignment 4',
                color      : 'blue',
                startDate  : new Date(2011, 0, 10, 12),
                endDate    : new Date(2011, 0, 10, 13)
            }, {
                id         : 'event5',
                cls        : 'event5',
                resourceId : 'r1',
                name       : 'Assignment 5',
                color      : 'indigo',
                startDate  : new Date(2011, 0, 10, 13),
                endDate    : new Date(2011, 0, 10, 14)
            }]
        });

        resourceStore = t.getResourceStore({
            data : [
                { id : 'r1', name : 'Mike',  eventColor : 'red' }
            ]
        });

        calendar = await t.getCalendar({
            eventStore,
            resourceStore,
            sidebar : false,
            width   : 1000,
            height  : 750,
            date    : new Date(2011, 0, 1),
            mode    : 'month',
            modes   : {
                month : {
                    overflowButtonRenderer(buttonConfig, count) {
                        // Scope correct
                        t.ok(this.isMonthView);

                        buttonConfig.className['b-fa'] = buttonConfig.className['b-fa-list'] = 1;
                        buttonConfig.text = `overflow by ${count}`;
                        buttonConfig.style.justifyContent = 'unset';

                        return buttonConfig;
                    }
                }
            }
        });
        t.selectorExists('.b-cal-cell-overflow.b-fa-list.b-fa:contains(overflow by 3)');
    });

    t.it('overflowButtonRenderer as string', async t => {
        eventStore = t.getEventStore({
            data : [{
                id         : 'event1',
                cls        : 'event1',
                resourceId : 'r1',
                name       : 'Assignment 1',
                color      : 'red',
                startDate  : new Date(2011, 0, 10, 9),
                endDate    : new Date(2011, 0, 10, 10)
            }, {
                id         : 'event2',
                cls        : 'event2',
                resourceId : 'r1',
                name       : 'Assignment 2',
                color      : '#f1c114',
                startDate  : new Date(2011, 0, 10, 10),
                endDate    : new Date(2011, 0, 10, 11)
            }, {
                id         : 'event3',
                cls        : 'event3',
                resourceId : 'r1',
                name       : 'Assignment 3',
                color      : 'green',
                startDate  : new Date(2011, 0, 10, 11),
                endDate    : new Date(2011, 0, 10, 12)
            }, {
                id         : 'event4',
                cls        : 'event4',
                resourceId : 'r1',
                name       : 'Assignment 4',
                color      : 'blue',
                startDate  : new Date(2011, 0, 10, 12),
                endDate    : new Date(2011, 0, 10, 13)
            }, {
                id         : 'event5',
                cls        : 'event5',
                resourceId : 'r1',
                name       : 'Assignment 5',
                color      : 'indigo',
                startDate  : new Date(2011, 0, 10, 13),
                endDate    : new Date(2011, 0, 10, 14)
            }]
        });

        resourceStore = t.getResourceStore({
            data : [
                { id : 'r1', name : 'Mike',  eventColor : 'red' }
            ]
        });

        calendar = await t.getCalendar({
            eventStore,
            resourceStore,
            sidebar : false,
            width   : 1000,
            height  : 750,
            date    : new Date(2011, 0, 1),
            mode    : 'month',
            modes   : {
                month : {
                    overflowButtonRenderer : 'up.overflowButtonRenderer'
                }
            },
            overflowButtonRenderer(buttonConfig, count) {
                // Scope correct
                t.ok(this.isCalendar);

                buttonConfig.className['b-fa'] = buttonConfig.className['b-fa-list'] = 1;
                buttonConfig.text = `overflow by ${count}`;
                buttonConfig.style.justifyContent = 'unset';

                return buttonConfig;
            }
        });
        t.click('.b-cal-cell-overflow.b-fa-list.b-fa:contains(overflow by 3)');

        await t.click(calendar.activeView.overflowPopup.titleElement);

        await t.waitForAnimations();

        t.is(calendar.mode, 'day');
        t.is(calendar.date, new Date(2011, 0, 10));
    });

    // TODO check this edge case.
    t.xit('overflowing events bug 1', async t => {
        eventStore = t.getEventStore({
            data : [
                {
                    id             : 1,
                    startDate      : '2020-10-11T00:00:00+02:00',
                    endDate        : '2020-10-19T00:00:00+02:00',
                    duration       : 6.916666666666667,
                    durationUnit   : 'day',
                    cls            : '',
                    name           : 'Hackathon 2020',
                    exceptionDates : [],
                    resourceId     : 'bryntum',
                    allDay         : true,
                    eventColor     : 'green'
                },
                {
                    id             : 2,
                    startDate      : '2020-10-11T14:00:00+02:00',
                    endDate        : '2020-10-11T18:00:00+02:00',
                    duration       : 0.16666666666666666,
                    durationUnit   : 'day',
                    cls            : '',
                    name           : 'Check-In in Hotel',
                    exceptionDates : [],
                    resourceId     : 'hotel',
                    allDay         : false
                },
                {
                    id             : 3,
                    startDate      : '2020-10-11T00:00:00+02:00',
                    endDate        : '2020-10-12T00:00:00+02:00',
                    duration       : 0.08333333333333333,
                    durationUnit   : 'day',
                    cls            : '',
                    name           : 'Relax and official arrival beer',
                    exceptionDates : [],
                    resourceId     : 'michael',
                    allDay         : true
                },
                {
                    id             : 4,
                    startDate      : '2020-10-11T20:00:00+02:00',
                    endDate        : '2020-10-11T21:00:00+02:00',
                    duration       : 0.041666666666666664,
                    durationUnit   : 'day',
                    cls            : '',
                    name           : 'Dinner',
                    exceptionDates : [],
                    resourceId     : 'hotel',
                    allDay         : false
                },
                {
                    id             : 5,
                    startDate      : '2020-10-12T09:00:00+02:00',
                    endDate        : '2020-10-12T10:00:00+02:00',
                    duration       : 0.041666666666666664,
                    durationUnit   : 'day',
                    cls            : '',
                    name           : 'Breakfast',
                    recurrenceRule : 'FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR;UNTIL=20201022T085900',
                    exceptionDates : [
                        '2020-10-13T00:00:00+02:00',
                        '2020-10-22T00:00:00+02:00'
                    ],
                    resourceId : 'hotel',
                    allDay     : false
                },
                {
                    id             : 6,
                    startDate      : '2020-10-12T10:00:00+02:00',
                    endDate        : '2020-10-12T12:00:00+02:00',
                    duration       : 0.08333333333333333,
                    durationUnit   : 'day',
                    cls            : '',
                    name           : 'Team Scrum',
                    exceptionDates : [],
                    resourceId     : 'bryntum',
                    allDay         : false
                },
                {
                    id             : 7,
                    startDate      : '2020-10-12T12:00:00+02:00',
                    endDate        : '2020-10-12T14:00:00+02:00',
                    duration       : 0.08333333333333333,
                    durationUnit   : 'day',
                    cls            : '',
                    name           : 'Scheduler Grid introduction + review',
                    exceptionDates : [],
                    resourceId     : 'bryntum',
                    allDay         : false
                },
                {
                    id             : 8,
                    startDate      : '2020-10-12T14:00:00+02:00',
                    endDate        : '2020-10-12T15:00:00+02:00',
                    duration       : 0.041666666666666664,
                    durationUnit   : 'day',
                    cls            : '',
                    name           : 'Lunch',
                    exceptionDates : [],
                    resourceId     : 'hotel',
                    allDay         : false
                },
                {
                    id             : 9,
                    startDate      : '2020-10-13T15:00:00+02:00',
                    endDate        : '2020-10-20T19:00:00+02:00',
                    duration       : 7.166666666666667,
                    durationUnit   : 'day',
                    cls            : '',
                    name           : 'Active client project review',
                    exceptionDates : [],
                    resourceId     : 'bryntum',
                    allDay         : false
                },
                {
                    id             : 10,
                    startDate      : '2020-10-13T19:00:00+02:00',
                    endDate        : '2020-10-19T20:00:00+02:00',
                    duration       : 6.041666666666667,
                    durationUnit   : 'day',
                    cls            : '',
                    name           : 'Dinner',
                    exceptionDates : [],
                    resourceId     : 'hotel',
                    allDay         : false
                },
                {
                    id             : 12,
                    startDate      : '2020-10-15T00:00:00+02:00',
                    endDate        : '2020-10-16T00:00:00+02:00',
                    duration       : 0.08333333333333333,
                    durationUnit   : 'day',
                    cls            : '',
                    name           : 'Roadmapping for 2020',
                    exceptionDates : [],
                    resourceId     : 'bryntum',
                    allDay         : true
                },
                {
                    id             : 13,
                    startDate      : '2020-10-13T12:00:00+02:00',
                    endDate        : '2020-10-21T14:00:00+02:00',
                    duration       : 8.083333333333334,
                    durationUnit   : 'day',
                    cls            : '',
                    name           : 'Review Assembla tickets and decide features to add',
                    exceptionDates : [],
                    resourceId     : 'bryntum',
                    allDay         : false
                },
                {
                    id             : 14,
                    startDate      : '2020-10-13T14:00:00+02:00',
                    endDate        : '2020-10-20T15:00:00+02:00',
                    duration       : 7.041666666666667,
                    durationUnit   : 'day',
                    cls            : '',
                    name           : 'Lunch',
                    exceptionDates : [],
                    resourceId     : 'hotel',
                    allDay         : false
                },
                {
                    id             : 15,
                    startDate      : '2020-10-13T15:00:00+02:00',
                    endDate        : '2020-10-20T19:00:00+02:00',
                    duration       : 7.166666666666667,
                    durationUnit   : 'day',
                    cls            : '',
                    name           : 'Active programming',
                    exceptionDates : [],
                    resourceId     : 'bryntum',
                    allDay         : false
                },
                {
                    id             : 16,
                    startDate      : '2020-10-20T19:00:00+02:00',
                    endDate        : '2020-10-20T20:00:00+02:00',
                    duration       : 0.041666666666666664,
                    durationUnit   : 'day',
                    cls            : '',
                    name           : 'Dinner',
                    exceptionDates : [],
                    resourceId     : 'hotel',
                    allDay         : false
                },
                {
                    id             : 18,
                    startDate      : '2020-10-15T00:00:00+02:00',
                    endDate        : '2020-10-16T00:00:00+02:00',
                    duration       : 0.3333333333333333,
                    durationUnit   : 'day',
                    cls            : '',
                    name           : 'Excursion',
                    exceptionDates : [],
                    resourceId     : 'michael',
                    allDay         : true
                },
                {
                    id             : 19,
                    startDate      : '2020-10-20T18:00:00+02:00',
                    endDate        : '2020-10-20T22:00:00+02:00',
                    duration       : 0.16666666666666666,
                    durationUnit   : 'day',
                    cls            : '',
                    name           : 'Team Building',
                    exceptionDates : [],
                    resourceId     : 'michael',
                    allDay         : false,
                    eventColor     : 'green'
                },
                {
                    id             : 21,
                    startDate      : '2020-10-15T14:00:00+02:00',
                    endDate        : '2020-10-15T15:00:00+02:00',
                    duration       : 0.041666666666666664,
                    durationUnit   : 'day',
                    cls            : '',
                    name           : 'Lunch',
                    exceptionDates : [],
                    resourceId     : 'hotel',
                    allDay         : false
                },
                {
                    id             : 22,
                    startDate      : '2020-10-15T19:00:00+02:00',
                    endDate        : '2020-10-15T20:00:00+02:00',
                    duration       : 0.041666666666666664,
                    durationUnit   : 'day',
                    cls            : '',
                    name           : 'Dinner',
                    exceptionDates : [],
                    resourceId     : 'hotel',
                    allDay         : false
                },
                {
                    id             : 23,
                    startDate      : '2020-10-15T00:00:00+02:00',
                    endDate        : '2020-10-16T00:00:00+02:00',
                    duration       : 1,
                    durationUnit   : 'day',
                    cls            : '',
                    name           : 'Gantt review + development',
                    exceptionDates : [],
                    resourceId     : 'bryntum',
                    allDay         : true
                },
                {
                    id             : 25,
                    startDate      : '2020-10-16T14:00:00+02:00',
                    endDate        : '2020-10-16T15:00:00+02:00',
                    duration       : 0.041666666666666664,
                    durationUnit   : 'day',
                    cls            : '',
                    name           : 'Lunch',
                    exceptionDates : [],
                    resourceId     : 'hotel',
                    allDay         : false
                },
                {
                    id             : 26,
                    startDate      : '2020-10-13T18:00:00+02:00',
                    endDate        : '2020-10-20T21:00:00+02:00',
                    duration       : 7.125,
                    durationUnit   : 'day',
                    cls            : '',
                    name           : 'Split.JS conference: Monitoring and Reproducing Errors in Web Applications + Late Dinner or AfterParty',
                    exceptionDates : [],
                    resourceId     : 'michael',
                    allDay         : false
                },
                {
                    id             : 27,
                    startDate      : '2020-10-16T00:00:00+02:00',
                    endDate        : '2020-10-17T00:00:00+02:00',
                    duration       : 1,
                    durationUnit   : 'day',
                    cls            : '',
                    name           : 'Root Cause ticket bash',
                    exceptionDates : [],
                    resourceId     : 'bryntum',
                    allDay         : true
                },
                {
                    id             : 29,
                    startDate      : '2020-10-17T14:00:00+02:00',
                    endDate        : '2020-10-17T15:00:00+02:00',
                    duration       : 0.041666666666666664,
                    durationUnit   : 'day',
                    cls            : '',
                    name           : 'Lunch',
                    exceptionDates : [],
                    resourceId     : 'hotel',
                    allDay         : false
                },
                {
                    id             : 30,
                    startDate      : '2020-10-17T19:00:00+02:00',
                    endDate        : '2020-10-17T20:00:00+02:00',
                    duration       : 0.041666666666666664,
                    durationUnit   : 'day',
                    cls            : '',
                    name           : 'Dinner',
                    exceptionDates : [],
                    resourceId     : 'hotel',
                    allDay         : false
                },
                {
                    id             : 31,
                    startDate      : '2020-10-17T00:00:00+02:00',
                    endDate        : '2020-10-18T00:00:00+02:00',
                    duration       : 1,
                    durationUnit   : 'day',
                    cls            : '',
                    name           : 'Pair programming sessions',
                    exceptionDates : [],
                    resourceId     : 'bryntum',
                    allDay         : true
                },
                {
                    id             : 32,
                    startDate      : '2020-10-18T09:00:00+02:00',
                    endDate        : '2020-10-18T10:00:00+02:00',
                    duration       : 0.041666666666666664,
                    durationUnit   : 'day',
                    cls            : '',
                    name           : 'Breakfast',
                    exceptionDates : [],
                    resourceId     : 'hotel',
                    allDay         : false
                },
                {
                    id             : 33,
                    startDate      : '2020-10-18T10:00:00+02:00',
                    endDate        : '2020-10-18T12:00:00+02:00',
                    duration       : 0.08333333333333333,
                    durationUnit   : 'day',
                    cls            : '',
                    name           : 'Check-Out & Fly home',
                    exceptionDates : [],
                    resourceId     : 'michael',
                    allDay         : false
                },
                {
                    id             : '_generatedEventModelEx43',
                    startDate      : '2020-10-15T00:00:00+02:00',
                    endDate        : '2020-10-16T00:00:00+02:00',
                    duration       : 0.041666666666666664,
                    durationUnit   : 'day',
                    cls            : '',
                    name           : 'Breakfast',
                    recurrenceRule : null,
                    exceptionDates : [],
                    resourceId     : 'hotel',
                    allDay         : true
                },
                {
                    id             : '_generatedEventModelEx57',
                    startDate      : '2020-10-22T09:00:00+02:00',
                    endDate        : '2020-10-22T10:00:00+02:00',
                    duration       : 0.041666666666666664,
                    durationUnit   : 'day',
                    cls            : '',
                    name           : 'Breakfast',
                    recurrenceRule : 'FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR',
                    exceptionDates : [
                        '2020-10-13T00:00:00+02:00'
                    ],
                    resourceId : 'hotel',
                    allDay     : false
                }
            ]
        });

        resourceStore = t.getResourceStore({
            data : [
                {
                    id         : 'bryntum',
                    name       : 'Bryntum team',
                    eventColor : 'blue'
                },
                {
                    id         : 'hotel',
                    name       : 'Hotel Park',
                    eventColor : 'orange'
                },
                {
                    id         : 'michael',
                    name       : 'Michael Johnson',
                    eventColor : 'deep-orange'
                }
            ]
        });

        calendar = await t.getCalendar({
            eventStore,
            resourceStore,
            sidebar : false,
            width   : 1000,
            height  : 750,
            date    : new Date(2020, 9, 11),
            mode    : 'month'
        });
    });

    // https://github.com/bryntum/support/issues/3915
    t.it('overflowing events bug 2', async t => {
        eventStore = t.getEventStore({
            data : [
                {
                    id                         : 100763,
                    name                       : 'Tarea R1 : Tarea con el nombre muy muy largo!!',
                    description                : '&lt;p&gt;En &lt;u&gt;&lt;em&gt;&lt;s&gt;esta tarea&lt;/s&gt;&lt;/em&gt;&lt;/u&gt; se&lt;strong&gt;&#160;concentrar&#225;n&#160;&lt;/strong&gt;los prototipos de dise&#241;o relacionados con la administraci&#243;n de archivos y con el acceso a la aplicaci&#243;n m&#243;vil&lt;/p&gt;',
                    startDate                  : '2021-12-09T00:00:00',
                    endDate                    : '2021-12-24T23:59:59',
                    allDay                     : true,
                    resourceId                 : -856,
                    percentDone                : 15,
                    creationDate               : '2021-12-06T21:18:13.673',
                    durationEvent              : 12.00,
                    durationUnitEvent          : 'day',
                    activo                     : 'S',
                    prioridad                  : 'alta',
                    diasHolguraWarningSemaforo : 3,
                    relacion                   : 'En Proyecto: Proyecto : Asignaci&#243;n como responsable',
                    subtareas                  : 4,
                    responsable                : 'Leslie Haros',
                    responsableIniciales       : 'LH',
                    hito                       : 'N'
                },
                {
                    id                         : 100778,
                    name                       : 'Tarea R3.3',
                    startDate                  : '2021-12-07T00:00:00',
                    endDate                    : '2021-12-14T23:59:59',
                    allDay                     : true,
                    resourceId                 : -856,
                    percentDone                : 90,
                    creationDate               : '2021-12-06T21:19:58.063',
                    durationEvent              : 6.00,
                    durationUnitEvent          : 'day',
                    activo                     : 'S',
                    prioridad                  : 'normal',
                    diasHolguraWarningSemaforo : 3,
                    relacion                   : 'En Tarea: Tarea R3 - panel de consulta',
                    subtareas                  : 1,
                    responsable                : 'ESTEBAN Mej&#237;a Garc&#237;a PRIMERO',
                    responsableIniciales       : 'EM',
                    responsableImageUrl        : 'https://tprede.blob.core.windows.net/200265/tenant/200265/empleados/fotos/d5d89a58-be17-48d6-b78e-7daa78888acf.jpeg?sv=2018-03-28&amp;sr=c&amp;sig=wBGMT6jd1zgF8F21Vxu%2FU0TZlykJi19oHGmUwFHXQM8%3D&amp;st=2021-12-17T19%3A43%3A04Z&amp;se=2021-12-18T19%3A48%3A04Z&amp;sp=rwdl',
                    hito                       : 'N'
                },
                {
                    id                         : 101143,
                    name                       : 'Tarea : Vence el d&#237;a de hoy!',
                    startDate                  : '2021-12-15T00:00:00',
                    endDate                    : '2021-12-15T23:59:59',
                    allDay                     : true,
                    resourceId                 : -856,
                    percentDone                : 45,
                    creationDate               : '2021-12-16T19:03:58.623',
                    durationEvent              : 1.00,
                    durationUnitEvent          : 'day',
                    activo                     : 'S',
                    prioridad                  : 'normal',
                    diasHolguraWarningSemaforo : 3,
                    relacion                   : 'En Tarea: Tarea R1.2',
                    subtareas                  : 2,
                    responsable                : 'Leslie Haros',
                    responsableIniciales       : 'LH',
                    hito                       : 'N'
                },
                {
                    id        : 4,
                    name      : '15th',
                    startDate : '2021-12-15T00',
                    endDate   : '2021-12-15T09'
                }
            ]
        });

        resourceStore = t.getResourceStore({
            data : [
                {
                    id               : -856,
                    name             : 'Leslie Haros',
                    resourceInitials : 'LH',
                    eventColor       : '#007FB1'
                }
            ]
        });

        calendar = await t.getCalendar({
            eventStore,
            resourceStore,
            sidebar : false,
            width   : 1000,
            height  : 750,
            date    : new Date(2021, 11, 6),
            mode    : 'month'
        });
        const m = calendar.activeView;

        // Events which intersect a date occupy different cells.
        t.is(m._cellMap.get('2021-12-15').renderedEvents.length, 3);
        t.is(m._cellMap.get('2021-12-15').renderedEvents.firstFreeSlot, 3);
    });

    t.it('reconfiguring overflowPopup', async t => {
        eventStore = t.getEventStore({
            data : [{
                id         : 'event1',
                cls        : 'event1',
                resourceId : 'r1',
                name       : 'Assignment 1',
                color      : 'red',
                startDate  : new Date(2011, 0, 10, 9),
                endDate    : new Date(2011, 0, 10, 10)
            }, {
                id         : 'event2',
                cls        : 'event2',
                resourceId : 'r1',
                name       : 'Assignment 2',
                color      : '#f1c114',
                startDate  : new Date(2011, 0, 10, 10),
                endDate    : new Date(2011, 0, 10, 11)
            }, {
                id         : 'event3',
                cls        : 'event3',
                resourceId : 'r1',
                name       : 'Assignment 3',
                color      : 'green',
                startDate  : new Date(2011, 0, 10, 11),
                endDate    : new Date(2011, 0, 10, 12)
            }, {
                id         : 'event4',
                cls        : 'event4',
                resourceId : 'r1',
                name       : 'Assignment 4',
                color      : 'blue',
                startDate  : new Date(2011, 0, 10, 12),
                endDate    : new Date(2011, 0, 10, 13)
            }, {
                id         : 'event5',
                cls        : 'event5',
                resourceId : 'r1',
                name       : 'Assignment 5',
                color      : 'indigo',
                startDate  : new Date(2011, 0, 10, 13),
                endDate    : new Date(2011, 0, 10, 14)
            }]
        });

        resourceStore = t.getResourceStore({
            data : [
                { id : 'r1', name : 'Mike',  eventColor : 'red' }
            ]
        });

        calendar = await t.getCalendar({
            eventStore,
            resourceStore,
            sidebar : false,
            width   : 1000,
            height  : 750,
            date    : new Date(2011, 0, 1),
            mode    : 'month',
            modes   : {
                month : {
                    overflowPopup : {
                        eventList : false,
                        items     : {
                            testWidget : {
                                cls  : 'test-class',
                                html : 'There is overflow'
                            }
                        }
                    }
                }
            }
        });
        t.firesOnce(calendar.modes.month, 'showOverflowPopup');

        await t.click('.b-cal-cell-overflow');

        // Popup is there with extra content
        await t.waitForSelector('.b-overflowpopup .test-class:contains(There is overflow)');

        // eventList has been configured away
        t.selectorNotExists('.b-overflowpopup [data-ref="eventList"]');

        // Check property
        t.ok(calendar.modes.month.overflowPopup.isOverflowPopup);
    });

    t.it('vetoing overflowPopup', async t => {
        eventStore = t.getEventStore({
            data : [{
                id         : 'event1',
                cls        : 'event1',
                resourceId : 'r1',
                name       : 'Assignment 1',
                color      : 'red',
                startDate  : new Date(2011, 0, 10, 9),
                endDate    : new Date(2011, 0, 10, 10)
            }, {
                id         : 'event2',
                cls        : 'event2',
                resourceId : 'r1',
                name       : 'Assignment 2',
                color      : '#f1c114',
                startDate  : new Date(2011, 0, 10, 10),
                endDate    : new Date(2011, 0, 10, 11)
            }, {
                id         : 'event3',
                cls        : 'event3',
                resourceId : 'r1',
                name       : 'Assignment 3',
                color      : 'green',
                startDate  : new Date(2011, 0, 10, 11),
                endDate    : new Date(2011, 0, 10, 12)
            }, {
                id         : 'event4',
                cls        : 'event4',
                resourceId : 'r1',
                name       : 'Assignment 4',
                color      : 'blue',
                startDate  : new Date(2011, 0, 10, 12),
                endDate    : new Date(2011, 0, 10, 13)
            }, {
                id         : 'event5',
                cls        : 'event5',
                resourceId : 'r1',
                name       : 'Assignment 5',
                color      : 'indigo',
                startDate  : new Date(2011, 0, 10, 13),
                endDate    : new Date(2011, 0, 10, 14)
            }]
        });

        resourceStore = t.getResourceStore({
            data : [
                { id : 'r1', name : 'Mike',  eventColor : 'red' }
            ]
        });

        calendar = await t.getCalendar({
            eventStore,
            resourceStore,
            sidebar : false,
            width   : 1000,
            height  : 750,
            date    : new Date(2011, 0, 1),
            mode    : 'month',
            modes   : {
                month : {
                    overflowPopup : {
                        eventList : false,
                        items     : {
                            testWidget : {
                                cls  : 'test-class',
                                html : 'There is overflow'
                            }
                        }
                    },
                    listeners : {
                        beforeShowOverflowPopup() {
                            return false;
                        }
                    }
                }
            }
        });

        await t.click('.b-cal-cell-overflow');

        // Wait for any erroneous show of the overflow popup
        await t.waitFor(100);

        // Popup is not visible. It gets rendered because the showOverflowPopup event includes it
        t.selectorNotExists('.b-overflowpopup:visible');
    });

    t.it('overflowPopup configured away', async t => {
        eventStore = t.getEventStore({
            data : [{
                id         : 'event1',
                cls        : 'event1',
                resourceId : 'r1',
                name       : 'Assignment 1',
                color      : 'red',
                startDate  : new Date(2011, 0, 10, 9),
                endDate    : new Date(2011, 0, 10, 10)
            }, {
                id         : 'event2',
                cls        : 'event2',
                resourceId : 'r1',
                name       : 'Assignment 2',
                color      : '#f1c114',
                startDate  : new Date(2011, 0, 10, 10),
                endDate    : new Date(2011, 0, 10, 11)
            }, {
                id         : 'event3',
                cls        : 'event3',
                resourceId : 'r1',
                name       : 'Assignment 3',
                color      : 'green',
                startDate  : new Date(2011, 0, 10, 11),
                endDate    : new Date(2011, 0, 10, 12)
            }, {
                id         : 'event4',
                cls        : 'event4',
                resourceId : 'r1',
                name       : 'Assignment 4',
                color      : 'blue',
                startDate  : new Date(2011, 0, 10, 12),
                endDate    : new Date(2011, 0, 10, 13)
            }, {
                id         : 'event5',
                cls        : 'event5',
                resourceId : 'r1',
                name       : 'Assignment 5',
                color      : 'indigo',
                startDate  : new Date(2011, 0, 10, 13),
                endDate    : new Date(2011, 0, 10, 14)
            }]
        });

        resourceStore = t.getResourceStore({
            data : [
                { id : 'r1', name : 'Mike',  eventColor : 'red' }
            ]
        });

        calendar = await t.getCalendar({
            eventStore,
            resourceStore,
            sidebar : false,
            width   : 1000,
            height  : 750,
            date    : new Date(2011, 0, 1),
            mode    : 'month',
            modes   : {
                month : {
                    overflowPopup : null
                }
            }
        });

        await t.click('.b-cal-cell-overflow');

        // Wait for any erroneous show of the overflow popup
        await t.waitFor(100);

        // Popup is not there
        t.selectorNotExists('.b-overflowpopup');
    });

    t.it('overflowPopup with eventRenderer', async t => {
        eventStore = t.getEventStore({
            data : [{
                id         : 'event1',
                cls        : 'event1',
                resourceId : 'r1',
                name       : 'Assignment 1',
                color      : 'red',
                startDate  : new Date(2011, 0, 10, 9),
                endDate    : new Date(2011, 0, 10, 10)
            }, {
                id         : 'event2',
                cls        : 'event2',
                resourceId : 'r1',
                name       : 'Assignment 2',
                color      : '#f1c114',
                startDate  : new Date(2011, 0, 10, 10),
                endDate    : new Date(2011, 0, 10, 11)
            }, {
                id         : 'event3',
                cls        : 'event3',
                resourceId : 'r1',
                name       : 'Assignment 3',
                color      : 'green',
                startDate  : new Date(2011, 0, 10, 11),
                endDate    : new Date(2011, 0, 10, 12)
            }, {
                id         : 'event4',
                cls        : 'event4',
                resourceId : 'r1',
                name       : 'Assignment 4',
                color      : 'blue',
                startDate  : new Date(2011, 0, 10, 12),
                endDate    : new Date(2011, 0, 10, 13)
            }, {
                id         : 'event5',
                cls        : 'event5',
                resourceId : 'r1',
                name       : 'Assignment 5',
                color      : 'indigo',
                startDate  : new Date(2011, 0, 10, 13),
                endDate    : new Date(2011, 0, 10, 14)
            }]
        });

        resourceStore = t.getResourceStore({
            data : [
                { id : 'r1', name : 'Mike',  eventColor : 'red' }
            ]
        });

        calendar = await t.getCalendar({
            eventStore,
            resourceStore,
            sidebar : false,
            width   : 1000,
            height  : 750,
            date    : new Date(2011, 0, 1),
            mode    : 'month',
            modes   : {
                month : {
                    overflowPopup : {
                        eventRenderer({ eventRecord, renderData }) {
                            renderData.cls['b-overflow-event'] = 1;
                        }
                    }
                }
            }
        });

        await t.click('.b-cal-cell-overflow');

        // Wait for custom rendered events
        await t.waitForSelector('.b-overflowpopup .b-cal-event-wrap.b-overflow-event');
        t.selectorCountIs('.b-overflowpopup .b-cal-event-wrap.b-overflow-event', 5);
    });

    // https://github.com/bryntum/support/issues/4315
    t.it('Prev/next when MonthView contains cell for new date', async t => {
        calendar = await t.getCalendar({
            events    : t.getHackathonData().events.rows,
            resources : t.getHackathonData().resources.rows,
            date      : new Date(2019, 9, 30),
            modes     : {
                day    : null,
                week   : null,
                year   : null,
                agenda : null
            }
        });
        const eventCount = t.query('.b-cal-event-wrap').length;

        await t.click('[data-ref="prevButton"]');

        // No events in September
        await t.waitFor(() => t.query('.b-cal-event-wrap').length === 0);

        // This the month we are on now.
        // Next month's UI also will have
        calendar.date = new Date(2019, 8, 30);

        await t.click('[data-ref="nextButton"]');

        // back to October's event set
        await t.waitFor(() => t.query('.b-cal-event-wrap').length === eventCount);
    });
});
