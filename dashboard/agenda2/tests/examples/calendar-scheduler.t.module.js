StartTest(t => {
    let scheduler, calendar;

    t.beforeEach(t => {
        scheduler = bryntum.query('scheduler');
        calendar = scheduler.up(w => w.isCalendar);
    });

    t.it('Sanity', t => {
        const { count } = calendar.eventStore;

        t.chain(
            { click : '.b-sch-event-wrap:contains(Relax)' },

            { waitForSelector : '.b-sch-event-tooltip.b-eventedit.b-eventtip.b-floating:contains(Relax)' },

            { click : '.b-popup-close.b-tool' },

            { waitForSelectorNotFound : '.b-sch-event-tooltip.b-eventedit.b-eventtip.b-floating:contains(beer)' },

            { dblclick : '.b-sch-event-wrap:contains(Relax)' },

            { waitForSelector : '.b-eventeditor' },

            { click : '[data-ref="nameField"] .b-icon-remove.b-fieldtrigger' },

            { type : 'Free Beer!' },

            { click : '[data-ref="saveButton"]' },

            { drag : '.b-timeaxissubgrid .b-grid-row[data-index="1"', offset : [100, '50%'], by : [200, 0] },

            { waitFor : () => calendar.features.eventEdit.editor?.containsFocus },

            { type : '[ESCAPE]' },

            { waitForAnimations : null },

            // ESCAPE must have removed the new record
            next => {
                t.is(calendar.eventStore.count, count);
                next();
            },

            () => scheduler.timeAxisSubGrid.scrollable.scrollTo(0, 0),

            { drag : '.b-timeaxissubgrid .b-grid-row[data-index="1"', offset : [100, '50%'], by : [200, 0] },

            { waitFor : () => calendar.features.eventEdit.editor?.containsFocus },

            { type : 'Drag created' },

            { click : '[data-ref="saveButton"]' },

            // drag-create must have worked
            next => {
                t.is(scheduler.eventStore.findByField('name', 'Drag created').length, 1);
                t.selectorExists('.b-sch-event-wrap:contains(Drag created)');
                next();
            },

            { click : '[data-ref="weekShowButton"]' },

            { waitForSelector : '.b-cal-event-wrap:contains(Free Beer)' },

            { waitForSelectorNotFound : '.b-cal-event-wrap:contains(Relax)' }
        );
    });

    t.it('EventMenu', async t => {
        const
            { count } = calendar.eventStore,
            freeBeer   = scheduler.eventStore.getById(2);

        await t.click('[data-ref="timelineShowButton"]');

        await t.waitForAnimations();

        await scheduler.scrollEventIntoView(scheduler.eventStore.getById(2));

        await t.rightClick('.b-sch-event-wrap[data-event-id="2"]');

        await t.waitFor(() => calendar.features.eventMenu.menu.containsFocus);

        await t.type(null, '[ESCAPE]');

        await t.type(null, ' ');

        await t.waitFor(() => calendar.features.eventMenu.menu.containsFocus);

        // Invoke the Edit item
        await t.type(null, ' ');

        await t.waitFor(() => calendar.features.eventEdit.editor.containsFocus);

        // Edit worked
        await t.type(null, 'Free Vodka', null, null, null, true);

        await t.click('[data-ref="saveButton"]');

        await t.waitFor(() => !calendar.features.eventEdit.editor.isVisible);

        // Invoke editor using ENTER directly on the event
        t.is(freeBeer.name, 'Free Vodka');

        await t.type(null, '[ENTER]');

        await t.waitFor(() => calendar.features.eventEdit.editor.containsFocus);
        
        await t.type(null, 'Free Beer', null, null, null, true);

        await t.click('[data-ref="saveButton"]');

        await t.waitFor(() => !calendar.features.eventEdit.editor.isVisible);

        // Edit worked
        t.is(freeBeer.name, 'Free Beer');

        await t.type(null, ' ');

        await t.waitFor(() => calendar.features.eventMenu.menu.containsFocus);

        // Invoke the Duplicate Event item
        await t.type(null, '[DOWN][DOWN][ENTER]');

        // EventMenu worked
        t.is(calendar.eventStore.count, count + 1);
    });

    // https://github.com/bryntum/support/issues/3323
    t.it('Step buttons should step one week', t => {
        t.chain(
            { click : '[data-ref="timelineShowButton"]' },

            { click : '[data-ref=nextButton]' },

            async() => {
                t.is(scheduler.timeAxis.startDate, new Date(2020, 9, 18, 7), 'Moved one week');
            },

            { click : '[data-ref=nextButton]' },

            async() => {
                t.is(scheduler.timeAxis.startDate, new Date(2020, 9, 25, 7), 'Moved another week');
            },

            { click : '[data-ref=prevButton]' },

            async() => {
                t.is(scheduler.timeAxis.startDate, new Date(2020, 9, 18, 7), 'Moved back a week');
            }
        );
    });
});
