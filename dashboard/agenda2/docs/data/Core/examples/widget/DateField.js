// uneditable datefield (user only allowed to use picker)
new DateField({
    label    : 'Not editable',
    editable : false,
    appendTo : targetElement,
    style    : 'margin-right: .5em'
});

//editable datefield (user can type)
new DateField({
    label    : 'Editable',
    editable : true,
    appendTo : targetElement,
    style    : 'margin-right: .5em'
});

//invalid datefield
new DateField({
    label    : 'Invalid',
    min      : new Date(2018,4,18),
    value    : new Date(2018,4,17),
    editable : true,
    appendTo : targetElement
});
