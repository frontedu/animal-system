new TextField({
    appendTo : targetElement,
    width    : 200,
    label    : 'Enter text',
    style    : 'margin-right: .5em'
});

new TextField({
    appendTo  : targetElement,
    clearable : true,
    width     : 200,
    label     : 'Clearable',
    value     : 'Hello',
    style     : 'margin-right: .5em'
});

new TextField({
    appendTo : targetElement,
    width    : 200,
    label    : 'With custom trigger',
    triggers : {
        plug : {
            cls     : 'b-fa b-fa-plug',
            tooltip : 'Do something special'
        }
    },
    style    : 'margin-right: .5em'
});
