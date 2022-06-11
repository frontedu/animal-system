// Using default look
new SlideToggle({
    appendTo : targetElement,
    text     : 'Default'
});

// Using blue color
new SlideToggle({
    appendTo : targetElement,
    color    : 'b-blue',
    text     : 'Blue'
});

// Using orange color, initially checked
new SlideToggle({
    appendTo : targetElement,
    color    : 'b-orange',
    checked  : true,
    text     : 'Orange (toggled)'
});

// Starting disabled
new SlideToggle({
    appendTo : targetElement,
    disabled : true,
    text     : 'Disabled'
});
