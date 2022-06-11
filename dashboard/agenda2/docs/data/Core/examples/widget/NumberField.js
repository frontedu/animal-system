new NumberField({
    appendTo : targetElement,
    width    : 200,
    label    : 'Enter a number',
    style    : 'margin-right: .5em'
});

new NumberField({
    appendTo  : targetElement,
    clearable : true,
    width     : 200,
    label     : 'Clearable',
    value     : 100,
    style     : 'margin-right: .5em'
});

new NumberField({
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
