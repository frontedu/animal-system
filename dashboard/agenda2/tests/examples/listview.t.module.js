StartTest(t => {
    t.it('Sanity', t => {
        t.chain(
            { waitForSelector : '.b-eventlist .b-grid-row' },

            // Check locale switching
            { click : 'button[data-ref="infoButton"]' },

            { click : '[data-ref="localeCombo"] [data-ref="expand"]' },

            { click : '.b-list-item[data-index="3"]' },

            { click : 'button[data-ref="infoButton"]' },

            { click : '[data-ref="localeCombo"] [data-ref="expand"]' },

            { click : '.b-list-item[data-index="0"]' }
        );
    });
});
