new Panel({
    appendTo: targetElement,

    width  : 600,
    height : 500,
    layout : 'vbox',

    items : [{
        type        : 'panel',
        title       : 'Collapse Me',
        collapsible : 'overlay',
        layout      : 'fit',

        items: [{
            type: 'widget',
            style: 'background-color: #eee; font-size: 6em; padding: 30px',
            html: 'Content Here'
        }]
    }, {
        type : 'widget',
        html : 'Lorem ipsum dolor sit amet '.repeat(50),
        style: 'padding: 1em'
    }]
});
