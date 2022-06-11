// grid with RowNumberColumn
let grid = new Grid({
    appendTo   : targetElement,
    // makes grid as high as it needs to be to fit rows
    autoHeight : true,
    width      : 300,
    data       : DataGenerator.generateData(5),
    columns    : [
        { type : 'rownumber' },
        { field : 'name', text : 'Name', flex : 1 },
    ]
});
