let grid = new Grid({
    appendTo : targetElement,

    // makes grid as high as it needs to be to fit rows
    autoHeight: true,

    features : {
        // enable striping
        stripe : true
    },

    data : DataGenerator.generateData(5),

    columns : [
        { field : 'name', text : 'Name', flex : 1 },
        { field : 'team', text : 'Team', flex : 1 },
        { type: 'number', field : 'rank', text : 'Rank', flex : 1 }
    ]
});
