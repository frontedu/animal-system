StartTest(t => {
    t.it('Sanity', t => {
        const
            calendar = bryntum.query('calendar'),
            view     = calendar.activeView;

        t.chain(
            { waitForSelector : '.b-cal-event-wrap' },

            { click : '.hourField .b-spin-up' },

            { waitFor : () => view.scrollable.y === 4 * 70 }
        );
    });
});
