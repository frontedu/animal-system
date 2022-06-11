const scheduler = new Scheduler({
    appendTo   : targetElement,
    autoHeight : true,

    features : {
        eventDragCreate : false,
        pan             : true
    },

    visibleDate : new Date(2021, 2, 1),
    startDate   : new Date(2021, 0, 1),
    endDate     : new Date(2021, 3, 1),

    columns : [
        { field : 'name', text : 'Name', width : 100 }
    ],

    resources : [
        { id : 1, name : 'Bernard' },
        { id : 2, name : 'Bianca' }
    ]
});
