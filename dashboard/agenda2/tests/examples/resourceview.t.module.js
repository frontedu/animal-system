StartTest(t => {
    async function navigated(t) {
        await t.waitForSelector('.b-calendar-viewcontainer.b-animating');
        await t.waitForSelectorNotFound('.b-calendar-viewcontainer.b-animating');
    }

    t.it('Should toggle working days', async t => {
        await t.click('[data-ref="toggleNonWorkingDays"]');

        t.selectorExists('.b-dayview-allday.b-nonworking-day');
    });

    t.it('Should filter out resource when clicking X', async t => {
        await t.click('.b-fa-times');

        t.selectorNotExists('.b-resourceview .b-resource-name:contains(Don Taylor)');
        t.selectorExists('.b-resourcefilter .b-list-item:not(.b-selected):contains(Don Taylor)');
    });

    t.it('Should display date when switching to Month mode', async t => {
        // see https://github.com/bryntum/support/issues/3664
        await t.click('[data-ref="monthResourcesShowButton"]');
        await navigated(t);

        t.selectorNotExists('.b-calendar-view-desc:contains(No resources)');
        t.selectorExists('.b-calendar-view-desc:contains(October, 2021)');
    });
});
