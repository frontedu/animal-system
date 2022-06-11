targetElement.innerHTML = '<p>This demo shows how to add a TimeRange and how to display a current time line:</p>';
const first             = DateHelper.startOf(new Date(), 'week'),
    scheduler         = new Scheduler({
        appendTo : targetElement,

        // makes scheduler as high as it needs to be to fit rows
        autoHeight : true,

        features : {
            timeRanges : {
                showCurrentTimeLine : true,
                showHeaderElements  : true,
                enableResizing      : true
            }
        },

        startDate : first,
        endDate   : DateHelper.add(first, 7, 'days'),

        columns : [
            { field : 'name', text : 'Name', width : 100 }
        ],

        resources : [
            { id : 1, name : 'Bernard' },
            { id : 2, name : 'Bianca' }
        ],

        events : [
            { id : 1, resourceId : 1, name : 'Interview', startDate : first, duration : 2, durationUnit : 'day' },
            {
                id           : 2,
                resourceId   : 1,
                name         : 'Press meeting',
                startDate    : DateHelper.add(first, 4, 'days', true),
                duration     : 2,
                durationUnit : 'day'
            },
            {
                id           : 3,
                resourceId   : 2,
                name         : 'Audition',
                startDate    : DateHelper.add(first, 1, 'days'),
                duration     : 2,
                durationUnit : 'day'
            },
            {
                id           : 4,
                resourceId   : 2,
                name         : 'Script deadline',
                startDate    : DateHelper.add(first, 5, 'days'),
                duration     : 2,
                durationUnit : 'day'
            }
        ],

        timeRanges : [
            { id : 1, name : 'Cool range', startDate : DateHelper.add(first, 2, 'days'), duration : 1, durationUnit : 'day' }
        ]
    });
