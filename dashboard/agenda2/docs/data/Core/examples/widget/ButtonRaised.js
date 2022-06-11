targetElement.innerHTML = `
<div id="first-raised" class="widgetRow"></div>
<div id="second-raised" class="widgetRow"></div>
`;

const onClick = () => Toast.show('Button clicked');

// WITH TEXT

// Text only
new Button({
    appendTo : 'first-raised',
    cls      : 'b-raised',
    text     : 'Text only',
    onClick
});

// Text & icon
new Button({
    appendTo : 'first-raised',
    cls      : 'b-raised',
    icon     : 'b-fa-cog',
    text     : 'Text & icon',
    onClick
});

// Text + badge
new Button({
    appendTo : 'first-raised',
    cls      : 'b-raised',
    badge    : 3,
    text     : 'Showing badge',
    color    : 'b-blue',
    onClick
});

// Disabled
new Button({
    appendTo : 'first-raised',
    cls      : 'b-raised',
    text     : 'Disabled',
    disabled : true
});

// ICONS ONLY

// Red
new Button({
    appendTo : 'second-raised',
    cls      : 'b-raised',
    icon     : 'b-fa-trash b-fa-fw',
    color    : 'b-red',
    onClick
});

// Purple
new Button({
    appendTo : 'second-raised',
    cls      : 'b-raised',
    icon     : 'b-fa-cog b-fa-fw',
    color    : 'b-purple',
    onClick
});

// Green
new Button({
    appendTo : 'second-raised',
    cls      : 'b-raised',
    icon     : 'b-fa-download b-fa-fw',
    color    : 'b-green',
    onClick
});

// Default color
new Button({
    appendTo : 'second-raised',
    cls      : 'b-raised',
    icon     : 'b-fa-info b-fa-fw',
    onClick
});
