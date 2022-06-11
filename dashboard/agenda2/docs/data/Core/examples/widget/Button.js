targetElement.innerHTML = `
<div id="first" class="widgetRow"></div>
<div id="second" class="widgetRow"></div>
<div id="third" class="widgetRow"></div>
<div id="fourth" class="widgetRow"></div>
`;

const onClick = () => Toast.show('Button clicked');

// Raised buttons
new Button({
    appendTo : 'first',
    cls      : 'b-raised',
    text     : 'Only text',
    color    : 'b-green',
    onClick
});

// Button with text + icon
new Button({
    appendTo : 'first',
    cls      : 'b-raised',
    icon     : 'b-fa-cog',
    text     : 'With icon',
    color    : 'b-blue',
    onClick
});

// Button with text + badge
new Button({
    appendTo : 'first',
    cls      : 'b-raised',
    badge    : 3,
    text     : 'With badge',
    color    : 'b-blue',
    onClick
});

// Raised disable
new Button({
    appendTo : 'first',
    cls      : 'b-raised',
    text     : 'Disabled',
    disabled : true
});

// FLAT

// flat Button with text only
new Button({
    appendTo : 'second',
    text     : 'Flat text',
    onClick
});

// flat Button with text & icon
new Button({
    appendTo : 'second',
    icon     : 'b-fa-cog',
    text     : 'Flat icon',
    onClick
});

// Button with text + badge
new Button({
    appendTo : 'second',
    badge    : 3,
    text     : 'Flat badge',
    color    : 'b-blue',
    onClick
});

// flat disabled
new Button({
    appendTo : 'second',
    text     : 'Disabled',
    disabled : true
});

// ICONS

new Button({
    appendTo : 'third',
    icon     : 'b-fa-trash b-fa-fw',
    cls      : 'b-raised',
    color    : 'b-red',
    onClick
});

new Button({
    appendTo : 'third',
    icon     : 'b-fa-cog b-fa-fw',
    cls      : 'b-raised',
    color    : 'b-blue',
    onClick
});

new Button({
    appendTo : 'third',
    icon     : 'b-fa-download b-fa-fw',
    cls      : 'b-raised',
    color    : 'b-green',
    onClick
});

new Button({
    appendTo : 'third',
    icon     : 'b-fa-info b-fa-fw',
    color    : 'b-blue',
    onClick
});

// ROUNDED ICONS

new Button({
    appendTo : 'fourth',
    icon     : 'b-fa-trash b-fa-fw',
    cls      : 'b-raised b-rounded',
    color    : 'b-red',
    onClick
});

new Button({
    appendTo : 'fourth',
    icon     : 'b-fa-cog b-fa-fw',
    cls      : 'b-raised b-rounded',
    color    : 'b-blue',
    onClick
});

new Button({
    appendTo : 'fourth',
    icon     : 'b-fa-download b-fa-fw',
    cls      : 'b-blue b-rounded',
    onClick
});

new Button({
    appendTo : 'fourth',
    icon     : 'b-fa-info b-fa-fw',
    cls      : 'b-blue b-rounded',
    onClick
});
