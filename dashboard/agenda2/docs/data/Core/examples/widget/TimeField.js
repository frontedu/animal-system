new TimeField({
    label : 'Not editable',
    editable    : false,
    style       : 'margin-right: .5em',
    appendTo    : targetElement
});

new TimeField({
    label : 'Editable',
    editable    : true,
    appendTo    : targetElement,
    picker : {
        items : {
            minute : {
                step : 5
            }
        }
    }
});
