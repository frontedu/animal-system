new Checkbox({
    appendTo  : targetElement,
    text      : 'Single item',
    container : [{
        type        : 'textfield',
        placeholder : 'Additional info...',
        flex        : 1
    }]
});

new Checkbox({
    appendTo  : targetElement,
    text      : 'Two items',
    inline    : true,  // can also use false to wrap a single item
    container : {
        from : {
            type        : 'textfield',
            placeholder : 'From...',
            flex        : 1
        },
        to : {
            type        : 'textfield',
            placeholder : 'To...',
            flex        : 1,
            style       : 'margin-left: 1em'
        }
    }
});

new Checkbox({
    appendTo  : targetElement,
    text      : 'Child form',
    container : {
        from : {
            type  : 'textfield',
            label : 'From',
            width : 'auto'
        },
        to : {
            type  : 'textfield',
            label : 'To',
            width : 'auto'
        }
    }
});
