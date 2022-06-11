new ResourceCombo({
    appendTo       : targetElement,
    editable       : true,
    valueField     : 'id',
    displayField   : 'name',
    label          : 'Pick a resource',
    value          : 1,
    showEventColor : true,

    store : new ResourceStore({
        data : [
            { id : 1, name : 'Arnold Smith', eventColor : 'blue' },
            { id : 2, name : 'Gloria Rogers', eventColor : 'green' },
            { id : 3, name : 'Jane Miller', eventColor : 'indigo' },
            { id : 4, name : 'Doug Miller', eventColor : 'red' }
        ]
    })
});
