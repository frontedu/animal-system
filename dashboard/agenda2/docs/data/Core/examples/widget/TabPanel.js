new TabPanel({
    appendTo : targetElement,
    height   : '14em',
    items    : [
        {
            title : 'One',
            items : [
                { type : 'text', label : 'First name', style : 'margin:2em 1em' },
                { type : 'text', label : 'Last name', style : 'margin:2em 1em' }
            ]

        },
        {
            title : 'Two',
            items : [
                { type : 'widget', html : 'Second' }
            ]
        },
        {
            title : 'Three',
            items : [
                { type : 'widget', html : 'Last' }
            ]
        }
    ]
});
