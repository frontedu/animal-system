const scheduler = new Scheduler({
    appendTo   : targetElement,
    autoHeight : true,
    eventStyle : 'border',

    columns : [
        { text : 'Name', field : 'name', width : 150 }
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
        small : {
            levelWidth : 600,
            rowHeight  : 30,
            barMargin  : 0,
            eventColor : 'pink'
        },
        normal : {
            levelWidth : '*',
            rowHeight  : 50,
            barMargin  : 10,
            eventColor : 'violet'
        }
    }
});
