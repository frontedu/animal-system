// checkbox with default look
new Checkbox({
    appendTo : targetElement,
    text     : 'Default'
});

// blue checkbox
new Checkbox({
    appendTo : targetElement,
    color    : 'b-blue',
    text     : 'Blue'
});

// orange checkbox, checked
new Checkbox({
    appendTo : targetElement,
    color    : 'b-orange',
    checked  : true,
    text     : 'Orange (checked)'
});

// orange checkbox, checked
new Checkbox({
    appendTo : targetElement,
    disabled : true,
    text     : 'Disabled'
});
