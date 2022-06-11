StartTest(t => {
    let el, h, offset, tentativeDates, eventRecord;

    const checkTouchInFirefox = !t.browser.firefox || new Date() > new Date(2021, 5, 1);

    t.beforeEach(t => {
        h?.destroy();
        el = h = null;

        t.clearPageScroll();
    });

    t.describe('All Day', t => {
        t.beforeEach(t => {
            h = t.setupDayViewAllDayDragHarness();
        });

        t.it('Should do nothing if disabled', async t => {
            await h.init(t);

            h.calendar.features.drag.disabled = true;

            [el, offset] = await h.hoverEvent(h.Event.BeerTime);

            await h.drag(el, {
                offset,
                by : [100, 0]
            });

            t.notOk(t.isDragging(), 'Drag is not active');

            await h.drop();
        });

        t.it('Should do nothing when enabled', async t => {
            await h.init(t);

            [el, offset] = await h.hoverEvent(h.Event.BeerTime);

            await h.drag(el, {
                offset,
                by : [100, 0]
            });

            t.notOk(t.isDragging(), 'Drag is not active');

            await h.drop();
        });
    });

    t.describe('Day Detail', t => {
        let calendar;

        t.beforeEach(t => {
            h = t.setupDayViewDragHarness();

            calendar?.destroy?.();
        });

        t.it('Should do nothing if disabled', async t => {
            await h.init(t);

            h.calendar.features.drag.disabled = true;

            [el, offset] = await h.hoverEvent(h.Event.CheckInHotel);

            await h.drag(el, {
                offset,
                by : [0, 100]
            });

            t.notOk(t.isDragging(), 'Drag is not active');

            await h.drop();
        });

        t.it('Should do nothing if event is readOnly', async t => {
            await h.init(t);

            const event = h.calendar.eventStore.getById(h.Event.CheckInHotel);

            event.readOnly = true;
            event.clearChanges();

            await t.dragBy({
                source : '[data-event-id="2"]',
                offset : ['50%', '50%'],
                delta  : [0, -100]
            });

            t.notOk(event.isModified, 'Event not modified');
        });

        t.it('Should do nothing if validator vetoes', async t => {
            await h.init(t, {
                features : {
                    drag : {
                        validateMoveFn : 'up.validateMove'
                    }
                },
                validateMove : () => false
            });

            const
                event     = h.eventStore.getById(h.Event.CheckInHotel),
                startDate = new Date(event.startDate);

            [el, offset] = await h.hoverEvent(h.Event.CheckInHotel);

            await h.drag(el, {
                offset,
                by : [0, 100]
            });

            t.ok(t.isDragging(), 'Drag is not active');

            await h.drop();

            t.is(event.startDate, startDate, 'Event has not moved');
        });

        t.it('should abort drag operation on ESC keypress', async t => {
            await h.init(t);

            [el, offset, eventRecord] = await h.hoverEvent(h.Event.CheckInHotel);

            const { startDate, endDate } = eventRecord;

            await h.drag(el, {
                offset,
                by : [0, 42]
            });
            t.ok(t.isDragging(), 'Dragging is active');

            let tentativeDates = h.getTentativeDates();

            t.expect(tentativeDates).toEqual([
                [new Date(2019, 9, 14, 15), new Date(2019, 9, 14, 19), `3 PM${h.Text.CheckInHotel}7 PM`]
            ]);

            h.calendar.features.drag.footer = null;
            await t.moveCursorBy([0, -170]);

            tentativeDates = h.getTentativeDates();

            t.expect(tentativeDates).toEqual([
                [new Date(2019, 9, 14, 11), new Date(2019, 9, 14, 15), `11 AM${h.Text.CheckInHotel}`]
            ]);

            await t.type(null, '[ESC]');
            t.notOk(t.isDragging(), 'Dragging is not active');

            t.is(startDate, eventRecord.startDate, 'Same startDate');
            t.is(endDate, eventRecord.endDate, 'Same endDate');

            tentativeDates = h.getTentativeDates();

            t.expect(tentativeDates).toEqual([]);
        });

        t.it('Should move down 1 hour', async t => {
            await h.init(t);

            [el, offset] = await h.hoverEvent(h.Event.CheckInHotel);

            await h.drag(el, {
                offset,
                by : [0, h.DAY_PX_PER_HOUR]
            });

            t.ok(t.isDragging(), 'Drag is active');

            tentativeDates = h.getTentativeDates();

            t.expect(tentativeDates).toEqual([
                [new Date(2019, 9, 14, 15), new Date(2019, 9, 14, 19), `3 PM${h.Text.CheckInHotel}7 PM`]
            ]);

            await h.drop();
        });

        t.it('Should move up 1 hour', async t => {
            await h.init(t);

            [el, offset] = await h.hoverEvent(h.Event.CheckInHotel);

            await h.drag(el, {
                offset,
                by : [0, -h.DAY_PX_PER_HOUR]
            });

            t.ok(t.isDragging(), 'Drag is active');

            tentativeDates = h.getTentativeDates();

            t.expect(tentativeDates).toEqual([
                [new Date(2019, 9, 14, 13), new Date(2019, 9, 14, 17), `1 PM${h.Text.CheckInHotel}5 PM`]
            ]);

            await h.drop();
        });

        t.it('Should be able to convert short event to an allDay event', async t => {
            await h.init(t);

            [el, offset] = await h.hoverEvent(h.Event.CheckInHotel);

            await h.drag(el, {
                offset : ['50%', 20],
                by     : [0, -h.DAY_PX_PER_HOUR * 8]
            });

            t.ok(t.isDragging(), 'Drag is active');

            tentativeDates = h.getTentativeDates();

            t.expect(tentativeDates).toEqual([
                [new Date(2019, 9, 14), new Date(2019, 9, 15), h.Text.CheckInHotel]
            ]);

            await h.drop();

            await h.waitForSelector(
                '.b-dayview .b-calendarrow .b-cal-event-wrap:contains(Check-In in Hotel)',
                'Correctly dragged into all day zone');
        });

        t.it('should drag an event to midnight and not make it an inter-day or allDay event', async t => {
            await h.init(t, {
                modes : {
                    day : {
                        dayStartTime : 12
                    }
                }
            });

            const eventRecord = h.eventStore.getById(h.Event.CheckInHotel);

            [el, offset] = await h.hoverEvent(h.Event.CheckInHotel);

            await h.drag(el, {
                offset : ['50%', 20],
                by     : [0, h.DAY_PX_PER_HOUR * 6]
            });

            t.ok(t.isDragging(), 'Drag is active');

            tentativeDates = h.getTentativeDates();

            t.expect(tentativeDates).toEqual([
                [new Date(2019, 9, 14, 20), new Date(2019, 9, 15), `8 PM${h.Text.CheckInHotel}12 AM`]
            ]);

            await h.drop();

            t.is(eventRecord.startDate, new Date(2019, 9, 14, 20), 'Event moved to end at midnight');
            t.notOk(eventRecord.allDay, 'Event is not an allDay event');
            t.notOk(eventRecord.isInterDay, 'Event is not an interDay event');

            await h.waitForSelector(
                '.b-dayview .b-dayview-day-container .b-cal-event-wrap:contains(Check-In in Hotel)',
                {
                    desc    : 'Event correctly remained in day detail zone',
                    timeout : 500
                }
            );

            t.selectorNotExists('.b-dayview .b-calendarrow .b-cal-event-wrap:contains(Check-In in Hotel)', 'Event has not been hoisted into all day zone');
        });

        t.it('Should be able to convert short event to an allDay by dragging it to span midnight', async t => {
            await h.init(t, {
                modes : {
                    day : {
                        dayStartTime : 12
                    }
                }
            });

            [el, offset] = await h.hoverEvent(h.Event.CheckInHotel);

            await h.drag(el, {
                offset : ['50%', 20],
                by     : [0, h.DAY_PX_PER_HOUR * 7]
            });

            t.ok(t.isDragging(), 'Drag is active');

            tentativeDates = h.getTentativeDates();

            t.expect(tentativeDates).toEqual([
                [new Date(2019, 9, 14, 21), new Date(2019, 9, 15), `9 PM${h.Text.CheckInHotel}1 AM`]
            ]);

            await h.drop();

            await h.waitForSelector(
                '.b-dayview .b-calendarrow .b-cal-event-wrap:contains(Check-In in Hotel)',
                'Correctly dragged into all day zone');
        });

        t.it('Should scroll the view when dragging close to the edge', async t => {
            calendar = await t.getCalendar({
                mode   : 'day',
                date   : new Date(2021, 5, 2),
                events : [
                    { startDate : '2021-06-02T08:00:00', endDate : '2021-06-02T10:00:00', name : 'Event 1' }
                ],
                modes : {
                    day : {
                        visibleStartTime : 0
                    }
                }
            });

            const
                { activeView }      = calendar,
                { overflowElement } = activeView,
                event               = calendar.eventStore.last;

            //#region Drag event to the bottom edge

            await t.dragTo({
                source       : '.b-cal-event',
                target       : overflowElement,
                targetOffset : ['50%', '100%-30'],
                dragOnly     : true
            });

            // Wait until element is scrolled to the bottom
            await t.waitFor(() => Math.abs(overflowElement.scrollTop + overflowElement.clientHeight - overflowElement.scrollHeight) <= 1);

            await t.mouseUp(overflowElement, null, ['50%', `100%-${activeView.hourHeight * 2}`]);

            t.is(event.startDate, new Date(2021, 5, 2, 21), 'Start date is ok');
            t.is(event.endDate, new Date(2021, 5, 2, 23), 'End date is ok');

            //#endregion

            //region Drag event to the top edge

            await t.dragTo({
                source       : '.b-cal-event',
                target       : overflowElement,
                targetOffset : ['50%', 30],
                dragOnly     : true
            });

            // Wait until element is scrolled to the bottom
            await t.waitFor(() => overflowElement.scrollTop <= 1);

            await t.mouseUp(overflowElement, null, ['50%', activeView.hourHeight * 2]);

            t.is(event.startDate, new Date(2021, 5, 2, 1), 'Start date is ok');
            t.is(event.endDate, new Date(2021, 5, 2, 3), 'End date is ok');

            //endregion
        });

        t.describe('Page scrolled', t => {
            t.beforeEach(() => {
                t.enablePageScroll();
            });

            t.it('should drag when body is scrolled', async t => {
                await h.init(t);

                await h.moveCursorTo([300, 300]);  // move the cursor away so we get the mouse entry

                [el, offset] = await h.hoverEvent(h.Event.CheckInHotel);

                await h.drag(el, {
                    offset,
                    by : [0, h.DAY_PX_PER_HOUR]
                });

                t.ok(t.isDragging(), 'Drag is active');

                tentativeDates = h.getTentativeDates();

                t.expect(tentativeDates).toEqual([
                    [new Date(2019, 9, 14, 15), new Date(2019, 9, 14, 19), `3 PM${h.Text.CheckInHotel}7 PM`]
                ]);

                await h.drop();
            });
        });
    });

    checkTouchInFirefox && t.describe('TOUCH: Day Detail w/Touch', t => {
        t.beforeEach(t => {
            h = t.setupDayViewDragHarness();
        });

        t.it('TOUCH: Should move down 1 hour', async t => {
            await h.init(t);

            const eventRecord = h.eventStore.getById(h.Event.CheckInHotel);

            t.is(eventRecord.startDate, new Date(2019, 9, 14, 14), 'Correct startDate');
            t.is(eventRecord.endDate, new Date(2019, 9, 14, 18), 'Correct endDate');

            [el, offset] = await h.hoverEvent(eventRecord.id);

            await h.touchDragBy(el, 0, h.DAY_PX_PER_HOUR);

            t.is(eventRecord.startDate, new Date(2019, 9, 14, 15), 'Correct startDate');
            t.is(eventRecord.endDate, new Date(2019, 9, 14, 19), 'Correct endDate');
        });

        t.it('TOUCH: Should move up 2 hours', async t => {
            await h.init(t);

            const eventRecord = h.eventStore.getById(h.Event.CheckInHotel);

            t.is(eventRecord.startDate, new Date(2019, 9, 14, 14), 'Correct startDate');
            t.is(eventRecord.endDate, new Date(2019, 9, 14, 18), 'Correct endDate');

            [el, offset] = await h.hoverEvent(eventRecord.id);

            await h.touchDragBy(el, 0, -2 * h.DAY_PX_PER_HOUR);

            t.is(eventRecord.startDate, new Date(2019, 9, 14, 12), 'Correct startDate');
            t.is(eventRecord.endDate, new Date(2019, 9, 14, 16), 'Correct endDate');
        });

        t.describe('TOUCH: Page scrolled', t => {
            t.beforeEach(() => {
                t.enablePageScroll();
            });

            t.it('TOUCH: should drag when body is scrolled', async t => {
                await h.init(t);

                await h.moveCursorTo([300, 300]);  // move the cursor away so we get the mouse entry

                const eventRecord = h.eventStore.getById(h.Event.CheckInHotel);

                t.is(eventRecord.startDate, new Date(2019, 9, 14, 14), 'Correct startDate');
                t.is(eventRecord.endDate, new Date(2019, 9, 14, 18), 'Correct endDate');

                [el, offset] = await h.hoverEvent(eventRecord.id);

                // TODO this line in DragContext produces the wrong answer:
                //  targetElement = DomHelper.elementFromPoint(touch.clientX + el.scrollLeft, touch.clientY + el.scrollTop);
                await h.touchDragBy(el, 0, h.DAY_PX_PER_HOUR);

                t.is(eventRecord.startDate, new Date(2019, 9, 14, 15), 'Correct startDate');
                t.is(eventRecord.endDate, new Date(2019, 9, 14, 19), 'Correct endDate');
            });
        });
    });
});
