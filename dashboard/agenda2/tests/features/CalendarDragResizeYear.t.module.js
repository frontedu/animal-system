
StartTest(t => {
    let h;

    t.beforeEach(() => {
        h?.destroy();
        h = null;

        t.clearPageScroll();

        h = t.setupYearViewDragHarness();
    });

    t.it('Should do nothing', async t => {
        await h.init(t);

        const el = await h.hoverDate('2019-10-15');

        t.is(h.isHovering(el), '', 'Hovering disabled');
    });
});
