StartTest(t => {
    t.it('Sanity', t => {
        const
            calendar = bryntum.query('calendar'),
            { week } = calendar.modes;

        t.chain(
            { waitForSelector : '.b-cal-event-wrap' },

            { click : 'input[placeholder="Highlight tasks"]'},

            { waitForEvent : [week, 'refresh'], trigger : { type : 'C' } },

            { waitForSelector : '.b-highlighting' },

            next => {
                t.selectorCountIs('.b-cal-event-wrap.b-match', 4, 'Found correct number of matches');
                next();
            },

            { waitForEvent : [week, 'refresh'], trigger : { type : '[BACKSPACE]' } },

            { waitForSelectorNotFound : '.b-highlighting' },

            next => {
                t.selectorCountIs('.b-cal-event-wrap.b-match', 0, 'Found correct number of matches');
                next();
            },

            { click : 'input[placeholder="Find tasks by name"]' },

            { waitForEvent : [week, 'refresh'], trigger : { type : 'C' } },

            { waitFor : () => calendar.eventStore.count === 4 },

            () => {
                t.selectorCountIs('.b-cal-event-wrap', 4, 'Found correct number of events rendered');
            }
        );
    });
});
