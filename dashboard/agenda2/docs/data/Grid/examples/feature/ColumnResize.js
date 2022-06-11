targetElement.innerHTML = '<p>Drag the edge between two headers to resize columns</p>';
let grid                = new Grid({
    appendTo : targetElement,

    // makes grid as high as it needs to be to fit rows
    autoHeight : true,

    features : {
        // this feature is actually enabled by default,
        // so no need for this unless you have changed defaults
        columnResize : true
    },

    data : DataGenerator.generateData(5),

    columns : [
        { field : 'firstName', text : 'First name', width : 150 },
        { field : 'surName', text : 'Surname', width : 150 },
        { type : 'date', field : 'start', text : 'Start', width : 150 },
        { type : 'date', field : 'finish', text : 'Finish', flex : 1 }
    ]
});
