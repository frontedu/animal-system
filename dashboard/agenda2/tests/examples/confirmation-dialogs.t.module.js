StartTest(async t => {
    await t.waitForSelector('.b-cal-event:contains(Breakfast)');

    const calendar = bryntum.query('calendar');
    t.firesOnce(calendar.eventStore, 'update');

    await t.dragBy('.b-cal-event:contains(Breakfast)', [0, -60]);
    await t.click('.b-button:contains(OK)');
});
