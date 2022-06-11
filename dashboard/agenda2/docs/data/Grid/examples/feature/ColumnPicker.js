targetElement.innerHTML = '<p>Right click on a column header to show ColumnPicker</p>';
let grid = new Grid({
    appendTo : targetElement,

    // makes grid as high as it needs to be to fit rows
    autoHeight : true,

    features : {
        // this feature is actually enabled by default,
        // so no need for this unless you have changed defaults
        columnPicker : true,

        // disabling other features to keep menu short
        sort: false,
        group: false
    },

    data : DataGenerator.generateData(5),

    columns : [
        { field : 'name', text : 'Name', flex : 1 },
        { field : 'score', text : 'Score', flex : 1 },
        { type : 'rating', field : 'rating', text : 'Rating', width : 180 }
    ]
});
