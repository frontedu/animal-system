const tree = new TreeGrid({
    appendTo : targetElement,

    autoHeight : true,

    data : [
        {
            name     : 'ABBA',
            iconCls  : 'b-icon fa-users',
            born     : '',
            children : [
                { name : 'Anni-Frid', born : 1945, iconCls : 'b-icon fa-user' },
                { name : 'Bjorn', born : 1945, iconCls : 'b-icon fa-user' },
                { name : 'Benny', born : 1946, iconCls : 'b-icon fa-user' },
                { name : 'Agnetha', born : 1950, iconCls : 'b-icon fa-user' }
            ]
        },
        {
            name     : 'Roxette',
            iconCls  : 'b-icon fa-users',
            born     : '',
            children : [
                { name : 'Per', born : 1959, iconCls : 'b-icon fa-user' },
                { name : 'Marie', born : 1958, iconCls : 'b-icon fa-user' }
            ]
        }
    ],

    columns : [
        { type : 'tree', field : 'name', text : 'Name', flex : 1 },
        { type : 'number', field : 'born', text : 'Born', flex : 1 }
    ]
});
