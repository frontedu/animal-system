targetElement.innerHTML = '<p>Copy/cut and paste events using keyboard shortcuts or context menu:</p>';

const scheduler = new Scheduler({
    appendTo : targetElement,

    // makes scheduler as high as it needs to be to fit rows
    autoHeight : true,

    startDate : new Date(2021, 1, 6),
    endDate   : new Date(2021, 1, 20),
    
    viewPreset : 'dayAndWeek',

    columns : [
        { field : 'name', text : 'Name', width : 100 }
    ],

    resources : [
        { id : 1, name : 'Bernard' },
        { id : 2, name : 'Bianca' }
    ],

    events : [
        { id : 1, resourceId : 1, name : 'Interview', startDate : '2021-02-06', endDate : '2021-02-07' },
        { id : 2, resourceId : 1, name : 'Press meeting', startDate : '2021-02-08', endDate : '2021-02-09' },
        { id : 3, resourceId : 2, name : 'Audition', startDate : '2021-02-07', endDate : '2021-02-09' },
        { id : 4, resourceId : 2, name : 'Script deadline', startDate : '2021-02-11', endDate : '2021-02-11' }
    ]
});
