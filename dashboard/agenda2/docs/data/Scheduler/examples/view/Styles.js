targetElement.innerHTML = '<p>This demo uses a few different styles and colors:</p>';
const scheduler = new Scheduler({
    appendTo : targetElement,

    // makes scheduler as high as it needs to be to fit rows
    autoHeight : true,

    startDate : new Date(2018, 4, 6),
    endDate   : new Date(2018, 4, 13),

    viewPreset : 'dayAndWeek',

    // default event color
    eventColor : 'indigo',

    // default event style
    eventStyle : 'border',

    columns : [
        { field : 'name', text : 'Name', width : 100 }
    ],

    resources : [
        { id : 1, name : 'Bernard' },
        { id : 2, name : 'Bianca' }
    ],

    events : [
        { id : 1, resourceId : 1, name : 'Interview', startDate : '2018-05-06', endDate : '2018-05-07', eventStyle : 'line' },
        { id : 2, resourceId : 1, name : 'Press meeting', startDate : '2018-05-08', endDate : '2018-05-09', eventColor : 'orange' },
        { id : 3, resourceId : 2, name : 'Audition', startDate : '2018-05-07', endDate : '2018-05-09', eventStyle : 'colored', eventColor : 'pink' },
        { id : 4, resourceId : 2, name : 'Script deadline', startDate : '2018-05-11', endDate : '2018-05-11', eventColor : 'blue' }
    ]
});
