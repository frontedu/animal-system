targetElement.innerHTML = '<p>Grab either end of an event and drag to resize it:</p>';
const scheduler         = new Scheduler({
    appendTo : targetElement,

    // makes scheduler as high as it needs to be to fit rows
    autoHeight : true,

    startDate : new Date(2018, 4, 6),
    endDate   : new Date(2018, 4, 13),

    columns : [
        { field : 'name', text : 'Name', width : 100 }
    ],

    resources : [
        { id : 1, name : 'Bernard' },
        { id : 2, name : 'Bianca' }
    ],

    events : [
        { id : 1, resourceId : 1, name : 'Resize me', startDate : '2018-05-07', endDate : '2018-05-10' },
        { id : 2, resourceId : 2, name : 'Not me', startDate : '2018-05-08', endDate : '2018-05-10', resizable : false, eventColor : 'red' }
    ]
});
