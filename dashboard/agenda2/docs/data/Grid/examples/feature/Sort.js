targetElement.innerHTML = '<p>Sorted by Name, click a header to sort ascending, again to sort descending</p>';

const grid = new Grid({
    appendTo : targetElement,

    // makes grid as high as it needs to be to fit rows
    autoHeight : true,

    features : {
        // sorting by name
        sort : 'name'
    },

    data : DataGenerator.generateData(5),

    columns : [
        { field : 'name', text : 'Name', flex : 1 },
        { field : 'city', text : 'City', flex : 1 },
        { type : 'number', field : 'score', text : 'Score', flex : 1 },
        { type : 'number', field : 'age', text : 'Age (no sort)', flex : 1, sortable : false }
    ]
});
