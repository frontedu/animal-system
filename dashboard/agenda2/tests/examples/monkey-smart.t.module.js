StartTest(async t => {
    const
        testConfig     = t.getConfig(),
        {
            webComponent,
            waitSelector
        }              = testConfig,
        selectorPrefix = webComponent && /webcomponent/.test(t.global.location.href) ? `${webComponent} ->` : '';

    // Use unique cookie session ID per test
    t.setRandomPHPSession();

    await t.waitForSelector(t.global.location.href.includes('websockets') ? '.b-scheduler' : (selectorPrefix + waitSelector));

    t.smartMonkeys();

    await t.waitForAnimations();
});
