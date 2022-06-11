// tree with ActionColumn
const tree = new TreeGrid({
    appendTo   : targetElement,
    autoHeight : true,
    columns    : [
        { type : 'tree', field : 'name', text : 'Name', flex : 1 },
        { type : 'number', field : 'born', text : 'Born', flex : 1 },
        { type : 'number', field : 'salary', text : 'Salary' },
        {
            type    : 'action',
            text    : 'Actions',
            actions : [{
                cls     : 'b-fa b-fa-minus',
                tooltip : 'Decrease salary',
                visible : ({ record }) => !Boolean(record.children && record.children.length),
                onClick : ({ record }) => {
                    if (record.salary > 1000) {
                        record.salary = record.salary - 1000;
                    }
                }
            }, {
                cls     : 'b-fa b-fa-plus',
                tooltip : 'Increase salary',
                visible : ({ record }) => !Boolean(record.children && record.children.length),
                onClick : ({ record }) => record.salary = record.salary + 1000
            }]
        }
    ],
    data : [
        {
            id       : 1,
            name     : 'ABBA',
            iconCls  : 'b-icon b-fa-users',
            born     : null,
            salary   : null,
            expanded : true,
            children : [
                { id : 11, name : 'Anni-Frid', born : 1945, salary : 50000, iconCls : 'b-icon b-fa-user' },
                { id : 12, name : 'Bjorn', born : 1945, salary : 140000, iconCls : 'b-icon b-fa-user' },
                { id : 13, name : 'Benny', born : 1946, salary : 400000, iconCls : 'b-icon b-fa-user' },
                { id : 14, name : 'Agnetha', born : 1950, salary : 40000, iconCls : 'b-icon b-fa-user' }
            ]
        },
        {
            id       : 2,
            name     : 'Roxette',
            iconCls  : 'b-icon b-fa-users',
            born     : null,
            salary   : null,
            children : [
                { id : 21, name : 'Per', born : 1959, salary : 88000, iconCls : 'b-icon b-fa-user' },
                { id : 22, name : 'Marie', born : 1958, salary : 70000, iconCls : 'b-icon b-fa-user' }
            ]
        }
    ]
});
