targetElement.innerHTML = '<p>A basic TreeGrid with minimal configuration:</p>';

let tree = new TreeGrid({
    appendTo : targetElement,

    // makes tree as high as it needs to be to fit rows
    autoHeight : true,

    data : [
        {
            id       : 1,
            name     : 'ABBA',
            iconCls  : 'b-icon b-fa-users',
            born     : null,
            expanded : true,
            children : [
                { id : 11, name : 'Anni-Frid', born : 1945, iconCls : 'b-icon b-fa-user' },
                { id : 12, name : 'Bjorn', born : 1945, iconCls : 'b-icon b-fa-user' },
                { id : 13, name : 'Benny', born : 1946, iconCls : 'b-icon b-fa-user' },
                { id : 14, name : 'Agnetha', born : 1950, iconCls : 'b-icon b-fa-user' }
            ]
        },
        {
            id       : 2,
            name     : 'Roxette',
            iconCls  : 'b-icon b-fa-users',
            born     : null,
            children : [
                { id : 21, name : 'Per', born : 1959, iconCls : 'b-icon b-fa-user' },
                { id : 22, name : 'Marie', born : 1958, iconCls : 'b-icon b-fa-user' }
            ]
        }
    ],

    columns : [
        { type : 'tree', field : 'name', text : 'Name', flex : 1 },
        { type : 'number', field : 'born', text : 'Born', flex : 1 }
    ]
});
