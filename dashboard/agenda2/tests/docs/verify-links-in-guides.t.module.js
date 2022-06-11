/*global DocsBrowserInstance*/

StartTest(t => {

    t.it('Open all links in guides and assert correct content + no crashes', async t => {

        const { navigationTree } = DocsBrowserInstance;

        DocsBrowserInstance.animateScroll = false;

        DocsBrowserInstance.onSettingsChange({
            settings : {
                showPublic    : true,
                showInternal  : true,
                showPrivate   : true,
                showInherited : true
            }
        });

        navigationTree.expandAll();

        await t.waitForSelectorNotFound('.loading');

        navigationTree.store.traverse(classRecord => {
            if (classRecord.isLeaf && classRecord.isGuide) {
                t.it(`Checking ${classRecord.id}`, async t => {
                    t.global.location.hash = classRecord.fullName;
                    t.suppressPassedWaitForAssertion = true;
                    await t.waitForSelector(`#content[data-id="${classRecord.id}"]`);
                    await t.waitForSelectorNotFound('.b-mask:contains(Loading),.fiddlePanelResult:empty,[data-error]');
                    await t.assertDocsLinks(classRecord);
                });
            }
        });
    });

    t.it('Verify upgrade guide link', async t => {
        await t.click('.b-upgrade-guide-button');
        await t.waitForSelector('h2[data-ref-id="api-version-diff"]');
        t.pass('Navigation is ok');
    });

});
