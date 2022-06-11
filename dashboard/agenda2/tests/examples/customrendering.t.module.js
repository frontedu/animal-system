StartTest(t => {
    t.it('Sanity', t => {
        t.chain(
            { waitForSelector : '.b-cal-event-wrap:contains(Team Hackathon) .b-fa-exclamation' },
            { waitForSelector : '.b-cal-event-wrap:contains(Team Hackathon) img[src]' },

            // All hints must show up.
            {
                waitFor : () => document.querySelectorAll('.b-tooltip.b-hint').length === Object.keys(window.shared.hints).length,
                desc    : 'All hints correctly shown'
            },

            { dblclick : '.b-cal-event-wrap:contains(Team Hackathon)' },

            { waitForSelector : '.b-eventeditor label:contains(Invitees)' },

            async() => t.selectorCountIs('.b-chipview .b-chip', 10),

            { click : '.b-chipview .b-chip .b-close-icon' },
            { click : '.b-chipview .b-chip .b-close-icon' },
            { click : '.b-chipview .b-chip .b-close-icon' },
            { click : '.b-chipview .b-chip .b-close-icon' },
            { click : '.b-chipview .b-chip .b-close-icon' },

            { click : '.b-button:textEquals(Save)' },

            { waitForSelector : '.b-cal-event-wrap:contains(Team Hackathon)' },

            { click : '[data-ref="modeSelector"] button:contains(Month)' },

            // Check custom renderer has worked properly
            {
                waitForSelector : '.b-calendar-cell.hackathon-dayoff.b-nonworking-day.b-dynamic-nonworking-day[data-date="2020-10-14"]',
                desc            : 'Custom renderer has worked properly'
            }
        );
    });

    t.it('Zero length allDay events', async t => {
        await t.click('[data-ref="prevMonth"]');
        await t.click('[data-ref="prevMonth"]');
        await t.click('[data-ref="prevMonth"]');
        await t.click('[data-ref="prevMonth"]');
        await t.click('[data-ref="prevMonth"]');

        // The date must be flagged with one event
        t.selectorExists('[data-ref="datePicker"] .b-calendar-cell[data-date="2020-05-25"] .b-icon.b-icon-circle.b-datepicker-1-to-3-events');

        await t.click('[data-ref="datePicker"] .b-calendar-cell[data-date="2020-05-25"]');

        // Event must show in MonthView
        await t.waitForSelector('.b-monthview-content .b-calendar-cell[data-date="2020-05-25"] .b-cal-event-wrap.b-allday:contains(Dave\'s birthday)');

        await t.click('[data-ref="modeSelector"] button:contains(Week)');

        // Event must show in WeekView
        await t.waitForSelector('.b-calendarrow-cell-container .b-calendar-cell[data-date="2020-05-25"] .b-cal-event-wrap.b-allday:contains(Dave\'s birthday)');

        await t.click('[data-ref="yearShowButton"]');

        // Event presence show in WeekView
        await t.click('.b-yearview .b-calendar-cell.b-cal-cell-overflow.b-datepicker-1-to-3-events .b-icon.b-fa-birthday-cake');

        // Overflow popup must show
        await t.waitForSelector('.b-overflowpopup[data-date="2020-05-25"]');
    });
});
