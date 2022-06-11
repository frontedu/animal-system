targetElement.innerHTML = '<p>This demo shows the built in colors available for resource time ranges:</p>';
const scheduler = new Scheduler({
    appendTo : targetElement,

    // makes scheduler as high as it needs to be to fit rows
    autoHeight : true,

    features : {
        resourceTimeRanges : true
    },

    startDate : new Date(2018, 10, 25),
    endDate   : new Date(2018, 11, 8),

    barMargin : 20,

    columns : [
        { field : 'name', text : 'Name', width : 100 }
    ],

    resources : [
        { id : 1, name : 'Lady' },
        { id : 2, name : 'Dude' }
    ],

    events : [
        { id : 1, resourceId : 1, name : 'Event 1', startDate : '2018-11-29', duration : 2 },
        { id : 2, resourceId : 2, name : 'Event 2', startDate : '2018-11-30', duration : 2 }
    ],

    resourceTimeRanges : [
        { id : 1, resourceId : 1, name : 'Red', timeRangeColor : 'red', startDate : '2018-11-25', duration : 2 },
        { id : 2, resourceId : 2, name : 'Pink', timeRangeColor : 'pink', startDate : '2018-11-25', duration : 2 },
        { id : 3, resourceId : 1, name : 'Purple', timeRangeColor : 'purple', startDate : '2018-11-27', duration : 2 },
        { id : 4, resourceId : 2, name : 'Violet', timeRangeColor : 'violet', startDate : '2018-11-27', duration : 2 },
        { id : 5, resourceId : 1, name : 'Indigo', timeRangeColor : 'indigo', startDate : '2018-11-29', duration : 2 },
        { id : 6, resourceId : 2, name : 'Blue', timeRangeColor : 'blue', startDate : '2018-11-29', duration : 2 },
        { id : 7, resourceId : 1, name : 'Cyan', timeRangeColor : 'cyan', startDate : '2018-12-01', duration : 2 },
        { id : 8, resourceId : 2, name : 'Teal', timeRangeColor : 'teal', startDate : '2018-12-01', duration : 2 },
        { id : 9, resourceId : 1, name : 'Green', timeRangeColor : 'green', startDate : '2018-12-03', duration : 2 },
        { id : 11, resourceId : 2, name : 'Lime', timeRangeColor : 'lime', startDate : '2018-12-03', duration : 2 },
        { id : 12, resourceId : 1, name : 'Yellow (default)', startDate : '2018-12-05', duration : 2 },
        { id : 13, resourceId : 2, name : 'Orange', timeRangeColor : 'orange', startDate : '2018-12-05', duration : 2 }
    ]
});
