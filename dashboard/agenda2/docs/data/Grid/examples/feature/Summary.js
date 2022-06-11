targetElement.innerHTML = '<p>Specify type of summary on a column to have it displayed in the footer</p>';

let grid = new Grid({
    appendTo : targetElement,

    // makes grid as high as it needs to be to fit rows
    autoHeight : true,

    features : {
        // enable summaries
        summary : true
    },

    data : DataGenerator.generateData(5),

    columns : [
        { field : 'name', text : 'Name', flex : 1 },
        { type: 'number', field : 'score', text : 'Score', flex : 1, sum : 'sum' },
        { type: 'number', field : 'rank', text : 'Rank', flex : 1, sum : 'average' }
    ]
});
