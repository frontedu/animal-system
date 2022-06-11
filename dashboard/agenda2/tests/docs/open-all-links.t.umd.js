"use strict";

/*global DocsBrowserInstance*/
StartTest(t => {
  t.it('Open all links in docs tree and assert correct content + no crashes', async t => {
    const {
      navigationTree
    } = DocsBrowserInstance,
          {
      ignoreTopics = [],
      docsTitle
    } = t.getConfig();
    DocsBrowserInstance.animateScroll = false;
    DocsBrowserInstance.onSettingsChange({
      settings: {
        showPublic: true,
        showInternal: true,
        showPrivate: true,
        showInherited: true
      }
    });
    navigationTree.expandAll();
    await t.waitForSelector(`#content h1:textEquals(${docsTitle})`);
    await t.waitForSelectorNotFound('.loading');
    navigationTree.store.traverse(classRecord => {
      if ((!classRecord.children || !classRecord.children.length) && !ignoreTopics.includes(classRecord.get('id')) && !classRecord.isGuide && classRecord.id !== 'apidiff') {
        t.it(`Checking ${classRecord.id}`, async t => {
          location.hash = classRecord.fullName;
          t.suppressPassedWaitForAssertion = true;
          await t.waitForSelector(`#content h1:contains(${classRecord.readableName})`);
          await t.waitForSelectorNotFound('.b-mask:contains(Loading),.fiddlePanelResult:empty,[data-error]');
          t.selectorCountIs('h1', 1, 'Exactly 1 H1 tag found');
          await t.assertDocsLinks(classRecord);
        });
      }
    });
    t.it('Should not see any global members, only classes', t => {
      for (const p in t.global.docsJson) {
        if (p !== 'classes') {
          t.fail(t.global.docsJson[p].map(o => o.name).join(', '), 'Should not find any top level members');
        }
      }
    });
  });
});