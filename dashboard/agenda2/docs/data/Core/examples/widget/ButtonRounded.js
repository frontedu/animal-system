targetElement.innerHTML = `
<div id="first-rounded" class="widgetRow"></div>
<div id="second-rounded" class="widgetRow"></div>
`;

const onClick = () => Toast.show('Button clicked');

// FLAT

// Text only
new Button({
    appendTo : 'first-rounded',
    cls      : 'b-rounded',
    text     : 'B',
    onClick
});

// Red
new Button({
    appendTo : 'first-rounded',
    cls      : 'b-rounded',
    icon     : 'b-fa-trash',
    color    : 'b-red',
    onClick
});

// Purple
new Button({
    appendTo : 'first-rounded',
    cls      : 'b-rounded',
    icon     : 'b-fa-cog',
    color    : 'b-purple',
    onClick
});

// Green
new Button({
    appendTo : 'first-rounded',
    cls      : 'b-rounded',
    icon     : 'b-fa-download',
    color    : 'b-green',
    onClick
});

// Default color
new Button({
    appendTo : 'first-rounded',
    cls      : 'b-rounded',
    icon     : 'b-fa-info',
    onClick
});

// RAISED

// Text only
new Button({
    appendTo : 'second-rounded',
    cls      : 'b-rounded b-raised',
    text     : 'B',
    onClick
});

// Red
new Button({
    appendTo : 'second-rounded',
    cls      : 'b-rounded b-raised',
    icon     : 'b-fa-trash',
    color    : 'b-red',
    onClick
});

// Purple
new Button({
    appendTo : 'second-rounded',
    cls      : 'b-rounded b-raised',
    icon     : 'b-fa-cog',
    color    : 'b-purple',
    onClick
});

// Green
new Button({
    appendTo : 'second-rounded',
    cls      : 'b-rounded b-raised',
    icon     : 'b-fa-download',
    color    : 'b-green',
    onClick
});

// Default color
new Button({
    appendTo : 'second-rounded',
    cls      : 'b-rounded b-raised',
    icon     : 'b-fa-info',
    onClick
});
