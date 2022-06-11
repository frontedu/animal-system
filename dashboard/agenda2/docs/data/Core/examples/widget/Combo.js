// combo with string items
new Combo({
    items    : ['Fanta', 'Loranga', 'Jaffa', 'Zingo', 'Orangina'],
    label    : 'Items as strings',
    appendTo : targetElement,
    style    : { marginRight : '.5em' }
});

// combo with object items
new Combo({
    items    : [{ value : 'pepsi', text : 'Pepsi' }, { value : 'coke', text : 'Coca Cola' }],
    label    : 'Items as objects',
    appendTo : targetElement,
    style    : { marginRight : '.5em' }
});

// uneditable combo (user can only pick from list)
new Combo({
    items    : [{ value : 'MtnDew', text : 'Mountain Dew' }, 'Sprite', '7up'],
    label    : 'Not editable',
    editable : false,
    appendTo : targetElement,
    style    : { marginRight : '.5em' }
});

// editable combo (user can type to filter)
new Combo({
    items    : ['Captain America', 'Hulk', 'She-Hulk', 'Hawkeye'],
    label    : 'Editable',
    editable : true,
    appendTo : targetElement
});
