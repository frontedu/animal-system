const grid = new Grid({
    appendTo : targetElement,

    height : 320,

    features : {
        // Enable the feature
        mergeCells : true,
        // Sort the city column to enable merging cells in it
        sort       : 'city'
    },

    data : DataGenerator.generateData(15),

    columns : [
        { field : 'city', text : 'City', flex : 1, mergeCells : true },
        { field : 'name', text : 'Name', flex : 1 },
        { field : 'food', text : 'Favorite food', flex : 1, mergeCells : true },
    ]
});
