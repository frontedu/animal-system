const grid = new Grid({
    appendTo : targetElement,

    autoHeight : true,

    features : {
        // Enable the feature
        mergeCells : true,
        // Sort the city column to enable merging cells in it
        sort       : 'city'
    },

    data : [
        { id : 1, city : 'Amsterdam', name : 'Daan', occupation : 'Cheesemaker', iconCls : 'b-fa b-fa-cheese' },
        { id : 2, city : 'Amsterdam', name : 'Levi', occupation : 'Tulip farmer', iconCls : 'b-fa b-fa-seedling' },
        { id : 3, city : 'Amsterdam', name : 'Emma', occupation : 'Tulip farmer', iconCls : 'b-fa b-fa-seedling' },
        { id : 4, city : 'Rome', name : 'Giulia', occupation : 'Art conservator', iconCls : 'b-fa b-fa-palette' },
        { id : 5, city : 'Rome', name : 'Francesco', occupation : 'Cheesemaker', iconCls : 'b-fa b-fa-cheese' },
    ],

    columns : [
        { field : 'city', text : 'City', flex : 1, mergeCells : true },
        { field : 'name', text : 'Name', flex : 1 },
        {
            field : 'occupation',
            text : 'Occupation',
            flex : 1,
            mergeCells : true,
            renderer({ record }) {
                return [
                    { tag : 'i', className : record.iconCls, style : 'margin-inline-end : .5em' },
                    record.occupation
                ]
            }
        }
    ]
});
