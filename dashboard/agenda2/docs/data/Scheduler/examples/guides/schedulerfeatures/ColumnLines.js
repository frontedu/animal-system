const scheduler = new Scheduler({
    appendTo : targetElement,

    autoHeight : true,
    rowHeight  : 40,
    barMargin  : 4,

    startDate : new Date(2018, 4, 6),
    endDate   : new Date(2018, 4, 20),

    viewPreset : {
        base            : 'dayAndWeek',
        timeColumnWidth : 30
    },

    columns : [
        { field : 'name', text : 'Name', width : 100 }
    ],

    resources : [
        { id : 1, name : 'Bernard' },
        { id : 2, name : 'Bianca' }
    ],

    events : [
        { id : 1, resourceId : 1, name : 'Interview', startDate : '2018-05-06', endDate : '2018-05-07' },
        { id : 2, resourceId : 1, name : 'Press meeting', startDate : '2018-05-08', endDate : '2018-05-09' },
        { id : 3, resourceId : 2, name : 'Audition', startDate : '2018-05-07', endDate : '2018-05-09' },
        { id : 4, resourceId : 2, name : 'Script deadline', startDate : '2018-05-11', endDate : '2018-05-11' }
    ]
});
