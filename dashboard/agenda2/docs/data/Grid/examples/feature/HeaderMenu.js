targetElement.innerHTML = '<p>Right click a header to display a context menu</p>';
let grid = new Grid({
    appendTo : targetElement,

    // makes grid as high as it needs to be to fit rows
    autoHeight: true,

    features : {
        // this feature is actually enabled by default,
        // so no need for this unless you have changed defaults
        headerMenu : true
    },

    data : DataGenerator.generateData(5),

    columns : [
        { field : 'name', text : 'Name', flex : 1 },
        { field : 'score', text : 'Score', flex : 1 }
    ]
});
