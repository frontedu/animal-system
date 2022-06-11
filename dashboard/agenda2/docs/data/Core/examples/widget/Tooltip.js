new Button({
    appendTo : targetElement,
    text     : 'Hover me',
    tooltip  : 'Tooltip for widget'
});

new Button({
    appendTo : targetElement,
    text     : 'I\'m async',
    tooltip  : {
        listeners : {
            beforeShow : ({ source : tip }) => {
                tip.html = new Promise(resolve => {
                    setTimeout(() => resolve('Async content!'), 2000);
                });
                // AjaxHelper.get('someurl').then(response => tip.html = 'Done!');
            }
        }
    }
});
