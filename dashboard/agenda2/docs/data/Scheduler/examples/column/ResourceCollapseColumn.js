const scheduler         = new Scheduler({
    appendTo : targetElement,

    // makes scheduler as high as it needs to be to fit rows
    autoHeight : true,

    startDate : new Date(2018, 4, 6),
    endDate   : new Date(2018, 4, 13),

    viewPreset        : 'dayAndWeek',
    eventStyle        : 'colored',
    resourceImagePath : 'data/Scheduler/images/users/',

    columns : [
        { type : 'resourceCollapse' },
        { type : 'resourceInfo', field : 'name', text : 'Name', width : 165 }
    ],

    resources : [
        { id : 1, name : 'Arnold Smith', image : 'arnold.jpg' },
        { id : 2, name : 'Gloria Rogers', image : 'gloria.jpg', eventLayout : 'none' },
        { id : 3, name : 'Jane Miller', eventColor : 'indigo', image : false, eventLayout : 'none' }
    ],

    events : [
        { id : 1, resourceId : 1, name : 'Interview', startDate : '2018-05-06', endDate : '2018-05-07' },
        { id : 2, resourceId : 1, name : 'Press meeting', startDate : '2018-05-06', endDate : '2018-05-09' },
        { id : 3, resourceId : 2, name : 'Audition', startDate : '2018-05-07', endDate : '2018-05-09' },
        { id : 4, resourceId : 2, name : 'Script deadline', startDate : '2018-05-08', endDate : '2018-05-11' },
        { id : 5, resourceId : 3, name : 'Rehearsal', startDate : '2018-05-07', endDate : '2018-05-09' },
        { id : 6, resourceId : 3, name : 'Rehearsal #2', startDate : '2018-05-08', endDate : '2018-05-10' }
    ]
});
