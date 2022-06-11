// grid with ColumnReorder enabled
const grid = new Grid({
    appendTo : targetElement,

    // makes grid as high as it needs to be to fit rows
    autoHeight : true,

    // features : {
    //     // this feature is actually enabled by default,
    //     // so no need for this unless you have changed defaults
    //     columnReorder : true
    // },

    data : DataGenerator.generateData(2),

    columns : [
        { field : 'firstName', text : 'First name (drag)', flex : 1 },
        { field : 'surName', text : 'Surname', flex : 1 },
        { type : 'date', field : 'start', text : 'Start', flex : 1 },
        { type : 'date', field : 'finish', text : 'Finish', flex : 1 }
    ]
});
