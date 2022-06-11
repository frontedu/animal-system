const grid = new Grid({
    appendTo : targetElement,

    // makes grid as high as it needs to be to fit rows
    autoHeight : true,

    features : {
        // cellEditing is actually enabled by default, so this is not necessary
        cellEdit : true
    },

    data : DataGenerator.generateData(2),

    columns : [
        // basic columns has a TextField as editor by default
        { field : 'name', text : 'Name', flex : 1 },
        // a custom editor can be specified
        {
            field  : 'city',
            text   : 'City',
            flex   : 1,
            editor : {
                type  : 'combo',
                items : ['Stockholm', 'New York', 'Moscow']
            }
        },
        // column types may specify an editor
        // NumberColumn for example uses a NumberField
        { type : 'number', field : 'score', text : 'Score', flex : 1 },
        // specify editor: false to make a column "readonly"
        { type : 'number', field : 'age', text : 'Age (readonly)', flex : 1, editor : false }
    ]
});
