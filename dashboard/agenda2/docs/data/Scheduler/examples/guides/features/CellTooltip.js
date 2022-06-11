const grid = new Grid({
    appendTo : targetElement,

    // makes grid as high as it needs to be to fit rows
    autoHeight : true,

    features : {
        // enable CellTooltip and configure a default renderer
        cellTooltip : {
            tooltipRenderer : ({ record, column }) => 'Value: ' + record[column.field],
            hoverDelay      : 200
        }
    },

    data : DataGenerator.generateData(2),

    columns : [
        { field : 'name', text : 'Name', flex : 1 },
        { field : 'score', text : 'Score', flex : 1 },
        { type : 'number', field : 'age', text : 'Age', flex : 1 }
    ]
});
