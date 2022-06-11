StartTest(async t => {

    const
        {
            DocsBrowserInstance,
            bryntum,
            product,
            productName
        }                  = t.global,
        { navigationTree } = DocsBrowserInstance,
        { router }         = bryntum,
        { engineGuide, linkAliases }    = t.getConfig(),
        routeTo            = async(t, link) => {
            t.diag(`Route to : ${link}`);
            await t.waitForEventOnTrigger(DocsBrowserInstance, 'contentUpdated', () => {
                router.routeTo(link);
            });
        },
        checkContent       = (t, id) => {
            const
                failed  = [],
                content = t.global.document.body.innerHTML,
                matches = re => [...content.matchAll(re)].map(m => m[0]);

            // No links to classes with #
            failed.push(...matches(new RegExp(`(href|src) *= *"#${id}.*?"`, 'gm')));

            // No links to .md files with #
            failed.push(...matches(/href *= *"\S+?\.md[#\S]*?"/gm));

            // Examples links should have trailing backslash
            document.querySelectorAll('a').forEach(link => {
                const href = link.getAttribute('href');
                if (href && href.includes('examples/') && !href.endsWith('/')) {
                    failed.push(href);
                }
            });

            if (failed.length > 0) {
                t.fail(`Found ${failed.length} invalid SEO link(s)`);
                failed.forEach(f => t.fail(f));
            }

            t.is(router.id, id, `Router has correct navigation id "${id}"`);
        };

    DocsBrowserInstance.animateScroll = false;

    t.ok(router.isOnline, 'Router has detected online mode correctly');

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

    t.it('Should have correct SEO links', async t => {
        navigationTree.store.traverse(classRecord => {
            if (!classRecord.isLeaf || ['apidiff', 'demos', 'engineDocs'].includes(classRecord.id) || classRecord.href.includes('/engine/')) {
                return;
            }
            t.it(`Checking ${classRecord.id}`, async t => {
                const
                    link      = `#${classRecord.id}`,
                    routeLink = router.getRoute(link);

                await routeTo(t, routeLink);
                await t.waitForSelectorNotFound('.b-mask:contains(Loading),.fiddlePanelResult:empty,[data-error]');
                checkContent(t, classRecord.id);
            });
        });
    });

    t.it('Should have correct SEO links in members popup', async t => {
        await routeTo(t, 'api/Core/Config');
        await t.moveCursorTo('#summary-configs');
        await t.waitForElementVisible('.b-summarytooltip .b-header-title:contains(Configs)');
        checkContent(t, 'Core/Config');
    });

    t.it('Should navigate to licenses, readme, npm and back to root with no errors', async t => {
        await routeTo(t, `guide/${productName}/licenses`);
        await t.waitForSelector(`[data-id="${productName}/licenses.md"]`);
        await routeTo(t, `guide/${productName}/readme`);
        await t.waitForSelector(`[data-id="${productName}/readme.md"]`);
        await routeTo(t, `guide/${productName}/npm-repository`);
        await t.waitForSelector(`[data-id="${productName}/guides/npm-repository.md"]`);
        await t.click('#title');
        await t.waitForSelector(`[data-id="${productName}/readme.md"]`);
    });

    t.it('Should support trailing slash in URL', async t => {
        await routeTo(t, 'api/Core/Config/');
        checkContent(t, 'Core/Config');
    });

    t.it('Should navigate on search', async t => {
        await t.type('#search-combo input', 'Widget', null, null, null, true);
        await t.waitForSelector('.search-hit:contains(Core.widget.Widget)');
        await t.click('.search-hit:contains(Core.widget.Widget)');
        await t.waitForElementVisible('.content-header:contains(Core.widget.Widget)');
    });

    t.it('Should navigate to non-existing URL with no errors', async t => {
        await routeTo(t, '#foo');
        await t.waitForSelector('.path-not-found');
        checkContent(t, 'foo');

        await routeTo(t, 'api/bar');
        await t.waitForSelector('.path-not-found');
        checkContent(t, 'bar');

        await routeTo(t, 'guide/foobar');
        await t.waitForSelector('.path-not-found');
        checkContent(t, 'foobar');
    });

    linkAliases && t.it('Should support link aliases', async t => {
        await routeTo(t, 'guide/Grid/integration/angular');
        await t.waitForSelector('[data-id="Grid/guides/integration/angular/guide.md"]');
        await routeTo(t, 'guide/Grid/integration/react');
        await t.waitForSelector('[data-id="Grid/guides/integration/react/guide.md"]');
        await routeTo(t, 'guide/Grid/integration/vue');
        await t.waitForSelector('[data-id="Grid/guides/integration/vue/guide.md"]');
    });

    // https://github.com/bryntum/support/issues/3557
    engineGuide && t.it('Should support engine guide link', async t => {
        await routeTo(t, engineGuide.link);
        checkContent(t, engineGuide.id);
    });

    // https://github.com/bryntum/support/issues/3546
    t.it('Should support navigating back', async t => {
        await routeTo(t, 'api/Core/mixin/Delayable');
        checkContent(t, 'Core/mixin/Delayable');

        await routeTo(t, 'api/Core/mixin/Draggable');
        checkContent(t, 'Core/mixin/Draggable');

        await t.waitForEventOnTrigger(DocsBrowserInstance, 'contentUpdated', () => {
            history.back();
        });

        checkContent(t, 'Core/mixin/Delayable');
    });

    // https://github.com/bryntum/support/issues/3657
    t.it('Should have correct examples online external link', async t => {
        navigationTree.collapseAll();
        const
            link     = `/examples/${product === 'schedulerpro' ? 'scheduler-pro' : product}/`,
            selector = `.b-tree-cell-inner[href="${link}"]`;

        t.is(router.getRoute('../examples'), link, 'Correct examples link');

        // Check navigation tree
        await t.waitForSelector(selector);
        let el = t.global.document.querySelector(selector);
        t.is(el.getAttribute('target'), '_blank', 'Examples link is external');

        // Check header tools
        const toolsSelector = `#tools>a[href="${link}"`;
        await t.waitForSelector(toolsSelector);
        el = t.global.document.querySelector(toolsSelector);
        t.is(el.getAttribute('target'), '_blank', 'Examples tools link is external');
    });

    t.it('Should have correct engine online external link', async t => {
        if (!['calendar', 'gantt', 'schedulerpro'].includes(product)) {
            t.diag('Skip test for unrelated products');
            return;
        }
        navigationTree.collapseAll();
        const selector = `.b-tree-cell-inner[href="./engine/"]`;
        await t.waitForSelector(selector);
        const el = t.global.document.querySelector(selector);
        t.is(el.getAttribute('target'), '_blank', 'Engine link is external');
    });

    t.it('Should not route to remote http, relative, root and empty links', t => {
        const checkRoute = link => t.notOk(router.routeTo(link), `Should not route to "${link}"`);

        checkRoute(undefined);
        checkRoute('/examples');
        checkRoute('../examples');
        checkRoute('./engine/');
        checkRoute('http://example.com/');
        checkRoute('https://example.com/');
    });

});
