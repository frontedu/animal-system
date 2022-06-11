StartTest(t => {
    t.it('Sanity', t => {
        const
            calendar = bryntum.query('calendar'),
            { eventStore } = calendar,
            startEventCount = eventStore.count;

        let newEvent;

        t.chain(
            // Click just after 10:30, should snap to 10:30
            { rightClick : '.b-dayview-day-detail.b-calendar-cell', offset : ['50%', calendar.modes.day.hourHeight * 10.6 ] },

            { click : '.b-menuitem[data-ref="addEvent"]' },

            { waitFor : () => calendar.features.eventEdit.editor?.containsFocus },

            { type : 'Added event[ENTER]' },

            next => {
                newEvent = eventStore.last;

                t.is(newEvent.name, 'Added event');
                t.is(newEvent.startDate, new Date(2020, 9, 11, 10, 30));
                next();
            },

            { rightClick : '.b-cal-event-wrap:contains(Added event)' },

            { click : '.b-menuitem[data-ref="deleteEvent"]' },

            next => {
                // Event has gone
                t.notOk(eventStore.includes(newEvent));
                next();
            },

            { rightClick : '.b-cal-event-wrap:contains(Check-In in Hotel)' },

            { click : '.b-menuitem[data-ref="duplicate"]' },

            next => {
                // One event duplicated
                t.is(eventStore.count, startEventCount + 1);
                next();
            },

            { click : '[data-ref="monthShowButton"]' },

            // Should use autoCreate's startHour
            { rightClick : '.b-monthview-content .b-calendar-cell[data-date="2020-10-09"]' },

            { click : '.b-menuitem[data-ref="addEvent"]' },

            { waitFor : () => calendar.features.eventEdit.editor?.containsFocus },

            { type : 'Added event[ENTER]' },

            next => {
                newEvent = eventStore.last;

                t.is(newEvent.name, 'Added event');
                t.is(newEvent.startDate, new Date(2020, 9, 9, calendar.activeView.autoCreate.startHour));
                next();
            },

            { rightClick : '.b-monthview-content .b-cal-event-wrap:contains(Added event)' },

            { click : '.b-menuitem[data-ref="deleteEvent"]' },

            next => {
                // Event has gone
                t.notOk(eventStore.includes(newEvent));
                next();
            },

            { rightClick : '.b-monthview-content .b-cal-event-wrap:contains(Relax and official arrival beer)' },

            { click : '.b-menuitem[data-ref="duplicate"]' },

            next => {
                // One event duplicated
                t.is(eventStore.count, startEventCount + 2);
                next();
            },

            { click : '[data-ref="yearShowButton"]' },

            // Should use autoCreate's startHour
            { rightClick : '.b-yearview-content .b-calendar-cell[data-date="2020-10-09"]' },

            { click : '.b-menuitem[data-ref="addEvent"]' },

            { waitFor : () => calendar.features.eventEdit.editor?.containsFocus },

            { type : 'Added event[ENTER]' },

            () => {
                newEvent = eventStore.last;

                t.is(newEvent.name, 'Added event');
                t.is(newEvent.startDate, new Date(2020, 9, 9, calendar.activeView.autoCreate.startHour));
            }
        );
    });
});
