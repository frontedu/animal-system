StartTest(t => {

    const calendar = bryntum.query('calendar');

    t.it('Sanity check', async t => {
        await t.waitForSelector('.b-cal-event');

        t.is(calendar.project.eventStore.count, 33, 'Events loaded correctly');
        t.is(calendar.project.resourceStore.count, 3, 'Resources loaded correctly');
    });

});
