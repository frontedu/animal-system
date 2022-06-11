const grid = new Grid({
    appendTo : targetElement,

    autoHeight : true,
    rowHeight  : 50,

    columns : [
        { text : 'Name', field : 'name', width : 160 }
    ],

    data : [
        { id : 1, name : 'Mr Boss' }
    ]
});
