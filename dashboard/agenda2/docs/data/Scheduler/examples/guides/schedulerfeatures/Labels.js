const scheduler = new Scheduler({
    appendTo : targetElement,

    autoHeight : true,
    barMargin  : 5,
    rowHeight  : 70,

    features : {
        labels : {
            topLabel    : 'location',
            bottomLabel : ({ eventRecord }) => `ID: ${eventRecord.id}`
        }
    },

    startDate : new Date(2018, 4, 6),
    endDate   : new Date(2018, 4, 13),

    columns : [
        { field : 'name', text : 'Name', width : 100 }
    ],

    resources : [
        { id : 1, name : 'Bernard' }
    ],

    events : [
        { id : 1, resourceId : 1, name : 'Interview', location : 'Office', startDate : '2018-05-07', endDate : '2018-05-10' }
    ]
});
