StartTest(t => {
    t.it('Sanity', t => {
        t.chain(
            { waitForSelector : '.b-cal-event-wrap' }
        );
    });
});
