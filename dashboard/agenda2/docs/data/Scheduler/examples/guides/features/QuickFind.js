const grid = new Grid({
    appendTo : targetElement,

    autoHeight : true,

    features : {
        // enable quickfind
        quickFind : true
    },

    data : DataGenerator.generateData(5),

    columns : [
        { field : 'name', text : 'Name', flex : 1 },
        { field : 'city', text : 'City', flex : 1 }
    ]
});
