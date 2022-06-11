const scheduler           = new Scheduler({
    appendTo : targetElement,

    // makes scheduler as tall as it needs to be to fit rows
    autoHeight : true,

    startDate : new Date(2022, 4, 6),
    endDate   : new Date(2022, 4, 13),

    columns : [
        { field : 'name', text : 'Name', width : 100 }
    ],

    resources : [
        { id : 1, name : 'Bernard' },
        { id : 2, name : 'Bianca' }
    ],

    events : [
        { id : 1, resourceId : 1, name : 'Drag in schedule to select', startDate : '2022-05-04', endDate : '2022-05-09' },
        { id : 2, resourceId : 1, name : 'Press meeting', startDate : '2022-05-11', endDate : '2022-05-14' },
        { id : 3, resourceId : 2, name : 'Audition', startDate : '2022-05-07', endDate : '2022-05-09' },
        { id : 4, resourceId : 2, name : 'Script deadline', startDate : '2022-05-11', endDate : '2022-05-11' }
    ],

    features : {
        eventDragSelect : true,
        eventDragCreate : false
    }
});
