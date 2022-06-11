// grid with TimeColumn
let grid = new Grid({
    appendTo : targetElement,

    // makes grid as high as it needs to be to fit rows
    autoHeight : true,

    data : [
        { id : 1, name : 'Gunde Svan', start : '11:08:00' },
        { id : 2, name : 'Thomas Wassberg', start : '12:18:00' },
        { id : 3, name : 'Sixten Jernberg', start : '12:21:00' },
    ],

    columns : [
        { field : 'name', text : 'Name', flex : 1 },
        { type : 'time', field : 'start', text : 'Time', format : 'HH:mm:ss', flex : 1 }
    ]
});
