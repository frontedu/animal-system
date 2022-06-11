const scheduler = new Scheduler({
    appendTo   : targetElement,
    autoHeight : true,
    rowHeight  : 50,
    eventStyle : 'colored',
    eventColor : 'teal',

    columns : [
        { text : 'Name', field : 'name', width : 150 },
        {
            text             : 'Company',
            field            : 'company',
            width            : 150,
            responsiveLevels : {
                small : { hidden : true },
                '*'   : { hidden : false }
            }
        }
    ],

    resourceStore : {
        fields : ['company'],
        data   : [
            { id : 1, name : 'Dan Stevenson', company : 'Small firm' },
            { id : 2, name : 'Talisha Babin', company : 'Big company' }
        ]
    },

    events : [
        {
            resourceId : 1,
            startDate  : '2017-01-05',
            endDate    : '2017-01-12',
            name       : 'Brainstorm',
            iconCls    : 'fa fa-boxes'
        },
        {
            resourceId : 2,
            startDate  : '2017-01-03',
            endDate    : '2017-01-09',
            name       : 'Fill in forms',
            iconCls    : 'fa fa-pen'
        }
    ],

    startDate : new Date(2017, 0, 1),
    endDate   : new Date(2017, 0, 10),

    responsiveLevels : {
        small  : 600,
        normal : '*'
    }
});
