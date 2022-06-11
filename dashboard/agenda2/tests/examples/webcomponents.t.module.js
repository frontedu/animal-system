StartTest(t => {
    let calendar;

    t.beforeEach(async t => {
        await t.waitFor(() => {
            calendar = bryntum.query('calendar');
            return calendar;
        });
    });

    t.it('Should support rendering + dragging event in a webcomponent', t => {

        t.chain(
            { waitForSelector : 'bryntum-calendar -> .b-cal-event' },

            async() => {
                t.isInstanceOf(calendar.element.querySelector('.b-cal-event'), HTMLElement, 'event rendered');
                t.firesOnce(calendar, 'eventclick');
                t.firesOnce(calendar.eventStore, 'update');
            },

            { click : 'bryntum-calendar -> .b-cal-event:contains(Click me)' },
            { drag : 'bryntum-calendar -> .b-cal-event', by : [-100, 0] },

            () => {
                const movedTask = calendar.eventStore.changes.modified[0];
                t.is(movedTask.startDate, new Date(2018, 3, 2, 10), 'Start Date updated');
            }
        );
    });

    t.it('Should support typing', t => {
        t.firesOnce(calendar, 'eventdblclick');
        t.firesOnce(calendar.eventStore, 'update');

        t.chain(
            { doubleClick : 'bryntum-calendar -> .b-cal-event:contains(Drag me)' },
            { type : 'foo[ENTER]', clearExisting : true },
            { waitForSelector : 'bryntum-calendar -> .b-cal-event:contains(foo)' }
        );
    });
});
