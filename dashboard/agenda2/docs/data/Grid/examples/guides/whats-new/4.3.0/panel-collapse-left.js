new Panel({
    appendTo: targetElement,

    width  : 600,
    height : 500,
    layout : 'hbox',

    items : [{
        type        : 'panel',
        title       : 'Collapse Me',
        flex        : 1,
        layout      : 'fit',
        collapsible : {
            direction : 'left',
            animation : { duration: 1000 }
        },

        items: [{
            type: 'widget',
            style: 'background-color: #eee; font-size: 4em; padding: 30px',
            html: 'Content Here'
        }]
    }, {
        type  : 'widget',
        html  : 'Lorem ipsum dolor sit amet '.repeat(50),
        flex  : 1,
        style : 'padding: 1em'
    }]
});
