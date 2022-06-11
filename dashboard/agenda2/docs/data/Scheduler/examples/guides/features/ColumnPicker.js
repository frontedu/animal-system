const grid = new Grid({
    appendTo : targetElement,

    autoHeight : true,

    features : {
        // this feature is actually enabled by default,
        // so no need for this unless you have changed defaults
        columnPicker : true,

        // disabling other features to keep menu short
        sort  : false,
        group : false
    },

    data : DataGenerator.generateData(2),

    columns : [
        { field : 'name', text : 'Name (right click)', flex : 1 },
        { field : 'score', text : 'Score', flex : 1 },
        { type : 'rating', field : 'rating', text : 'Rating', width : 180 }
    ]
});
