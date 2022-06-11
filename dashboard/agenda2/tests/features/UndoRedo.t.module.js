
StartTest(t => {
    // eslint-disable-next-line no-unused-vars
    let calendar;

    t.beforeEach(function() {
        calendar?.destroy();
    });

    t.it('Should support undo / redo after drag drop', async t => {
        calendar = await t.getCalendar({
            date    : new Date(2019, 9, 14),
            sidebar : false,
            mode    : 'week',
            project : {
                stm : {
                    autoRecord : true
                }
            },
            events : [{
                id           : 1,
                startDate    : new Date(2019, 9, 14, 12),
                duration     : 1,
                durationUnit : 'h'
            }]
        });

        const stm = calendar.project.stm;
        stm.disabled = false;

        await t.dragBy('.b-cal-event', [0, 100]);
        t.is(calendar.eventStore.changes.modified.length, 1, '1 change');

        await t.waitFor(() => stm.isReady);
        await t.type(null, 'Z', null, null, { ctrlKey : true });
        t.is(calendar.eventStore.changes, null, 'Undo ok: No changes');

        await t.type(null, 'Z', null, null, { shiftKey : true, ctrlKey : true });
        await t.waitFor(() => stm.isReady);
        t.is(calendar.eventStore.changes.modified.length, 1, 'Redo ok: 1 change');
    });

    t.it('Should support undo / redo after resize', async t => {
        calendar = await t.getCalendar({
            date    : new Date(2019, 9, 14),
            sidebar : false,
            mode    : 'week',
            project : {
                stm : {
                    autoRecord : true
                }
            },
            events : [{
                id           : 1,
                startDate    : new Date(2019, 9, 14, 12),
                duration     : 1,
                durationUnit : 'h'
            }]
        });

        const stm = calendar.project.stm;
        stm.disabled = false;

        await t.moveCursorTo('.b-cal-event', null, null, ['50%', '100%-3']);
        await t.dragBy('.b-hover-bottom .b-gripper.b-gripper-horz', [0, 100]);
        t.is(calendar.eventStore.changes.modified.length, 1, '1 change');

        await t.waitFor(() => stm.isReady);
        await t.type(null, 'Z', null, null, { ctrlKey : true });
        t.is(calendar.eventStore.changes, null, 'Undo ok: No changes');

        await t.type(null, 'Z', null, null, { shiftKey : true, ctrlKey : true });
        await t.waitFor(() => stm.isReady);
        t.is(calendar.eventStore.changes.modified.length, 1, 'Redo ok: 1 change');
    });
});
