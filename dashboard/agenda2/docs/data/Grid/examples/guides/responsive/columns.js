let grid = new Grid({
    appendTo         : targetElement,
    height           : 200,
    responsiveLevels : {
        small  : 400,
        normal : '*'
    },

    columns : [
        { text : 'Name', field : 'name', flex : 1 },
        {
            text             : 'Age',
            field            : 'age',
            flex             : 1,
            responsiveLevels : {
                small : { hidden : true },
                '*'   : { hidden : false }
            }
        }
    ],

    data : [
        { id : 1, name : 'Dan Stevenson', city : 'Los Angeles' },
        { id : 2, name : 'Talisha Babin', city : 'Paris' }
    ]
});
