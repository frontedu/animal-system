targetElement.innerHTML = '<p>Select a cell and start typing to search in that column. Go to next hit using F3 or CMD+g</p>';
let grid = new Grid({
    appendTo : targetElement,

    // makes grid as high as it needs to be to fit rows
    autoHeight: true,

    features : {
        // enable quickfind
        quickFind : true
    },

    data : DataGenerator.generateData(10),

    columns : [
        { field : 'name', text : 'Name', flex : 1 },
        { field : 'city', text : 'City', flex : 1 }
    ]
});
