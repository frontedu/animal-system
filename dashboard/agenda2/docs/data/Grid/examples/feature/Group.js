targetElement.innerHTML = '<p>Group by a column by pressing shift + clicking its header or by using the context menu</p>';
let grid = new Grid({
    appendTo : targetElement,

    // makes grid as high as it needs to be to fit rows
    autoHeight: true,

    features : {
        // group by food
        group : 'food'
    },

    data : DataGenerator.generateData(5),

    columns : [
        { field : 'name', text : 'Name', flex : 1 },
        { field : 'food', text : 'Favorite food', flex : 1 },
        { field : 'city', text : 'City', flex : 1 }
    ]
});
