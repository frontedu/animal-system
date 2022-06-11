StartTest(t => {

    const docsBrowser = window.DocsBrowserInstance;

    t.it('Check inline example', async t => {
        await docsBrowser.navigationTree.scrollCellIntoView({ id : 'api', column : 0 });
        await t.click('.b-grid-row[data-id="api"] .b-tree-expander');

        await docsBrowser.navigationTree.scrollCellIntoView({ id : 'Calendar', column : 0 });
        await t.click('.b-grid-row[data-id="Calendar"] .b-tree-expander');

        await docsBrowser.navigationTree.scrollCellIntoView({ id : 'Calendar/view', column : 0 });
        await t.click('.b-grid-row[data-id="Calendar/view"] .b-tree-expander');

        await docsBrowser.navigationTree.scrollCellIntoView({ id : 'Calendar/view/Calendar', column : 0 });
        await t.click('.b-grid-row[data-id="Calendar/view/Calendar"] a');

        const [exampleContainer] = await t.waitForSelector('section.external-examples');

        exampleContainer.scrollIntoView({ block : 'start' });

        const [calendarEl] = await t.waitForSelector('section.external-examples .b-calendar:not(.b-masked)');

        t.waitForSelector(`#${calendarEl.id} .b-cal-event-wrap`);
    });

});
