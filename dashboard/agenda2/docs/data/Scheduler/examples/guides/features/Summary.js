// grid with Summary feature
const grid = new Grid({
    appendTo : targetElement,

    autoHeight : true,

    features : {
        // enable summaries
        summary : true
    },

    data : DataGenerator.generateData(2),

    columns : [
        { field : 'name', text : 'Name', flex : 1 },
        { type : 'number', field : 'score', text : 'Score', flex : 1, sum : 'sum' },
        { type : 'number', field : 'rank', text : 'Rank', flex : 1, sum : 'average' }
    ]
});
