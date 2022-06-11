StartTest(t => {
    document.documentElement.addEventListener('click', event => {
        if (event.target.nodeName.toLowerCase() === 'a') {
            t.is(event.target.download, 'Twice Weekly scrum.ics', '`download` attr set correctly');
            t.like(event.target.href, new RegExp(`blob:${location.protocol}`), '`href` attr set correctly');
            event.preventDefault();
        }
    });

    t.chain(
        { dblClick : '.b-cal-event-wrap' },
        { click : '.b-button:contains(Outlook)' }
    );
});
