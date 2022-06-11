let grid = new Grid({
    appendTo : targetElement,
    height : 160,
    data : [],

    columns : [
        { field : 'name', text : 'Simple column', flex : 1 },
        { field : 'city', text : 'Grouped columns', align : 'center', children : [
            { width : 170, text : 'Sub column 1' },
            { width : 170, text : 'Sub column 2' }
            ]},
        { type: 'number', field : 'score', text : 'Right aligned column', align : 'right', flex : 1 }
    ]
});
