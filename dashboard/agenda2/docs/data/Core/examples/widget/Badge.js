// button with badge, click to increase
new Button({
    appendTo : targetElement,
    cls      : 'b-raised',
    text     : 'Click to increase',
    badge    : '1',
    style    : 'margin-right: 2em',
    onClick  : ({ source : button }) => button.badge++
});

new TextField({
    appendTo : targetElement,
    badge    : '4',
    label    : 'Text length',
    value    : 'Text',
    onInput  : ({ source : field }) => field.badge = field.value.length || ''
});
