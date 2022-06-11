// grid with NumberColumn
let grid = new Grid({
    appendTo   : targetElement,
    // makes grid as high as it needs to be to fit rows
    autoHeight : true,
    data       : DataGenerator.generateData(5),
    columns    : [
        { field : 'name', text : 'Name', flex : 1 },
        { type : 'number', field : 'score', text : 'NumberColumn', flex : 1 }
    ]
});
