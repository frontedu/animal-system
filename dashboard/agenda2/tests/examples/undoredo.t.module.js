StartTest(t => {
    const calendar = bryntum.query('calendar');

    t.it('Sanity', async t => {
        await t.waitForSelector('.b-cal-event-wrap');

        await t.dragBy('.b-cal-event-wrap:contains(Breakfast)', [100, 0]);
        await t.waitForSelector('[data-ref=redoBtn]:not(.b-badge)');
        await t.waitForSelector('.b-badge[data-ref=undoBtn][data-badge=1]');
        t.is(calendar.eventStore.changes.modified.length, 1);

        await t.click('.b-badge[data-ref=undoBtn][data-badge=1]');
        await t.waitForSelector('.b-badge[data-ref=redoBtn][data-badge=1]');
        await t.waitForSelector('[data-ref=undoBtn]:not(.b-badge)');
        t.is(calendar.eventStore.changes, null);

        await t.click('.b-badge[data-ref=redoBtn][data-badge=1]');
        await t.waitForSelector('[data-ref=redoBtn]:not(.b-badge)');
        await t.waitForSelector('.b-badge[data-ref=undoBtn][data-badge=1]');
        t.is(calendar.eventStore.changes.modified.length, 1);
    });
});
