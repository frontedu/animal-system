const scheduler = new Scheduler({
    appendTo           : targetElement,
    autoHeight         : true,
    rowHeight          : 50,
    autoAdjustTimeAxis : false,

    columns : [
        {
            text  : 'Name',
            field : 'name',
            width : 160
        }
    ],

    resources : [
        { id : 1, name : 'eventStyle' }
    ],

    events : [
        { resourceId : 1, startDate : '2021-01-03', duration : 2, durationUnit : 'day', name : 'plain', eventStyle : 'plain' },
        { resourceId : 1, startDate : '2021-01-03', duration : 2, durationUnit : 'day', name : 'border', eventStyle : 'border' },
        { resourceId : 1, startDate : '2021-01-06', duration : 2, durationUnit : 'day', name : 'colored', eventStyle : 'colored' },
        { resourceId : 1, startDate : '2021-01-06', duration : 2, durationUnit : 'day', name : 'hollow', eventStyle : 'hollow' },
        { resourceId : 1, startDate : '2021-01-09', duration : 2, durationUnit : 'day', name : 'line', eventStyle : 'line' },
        { resourceId : 1, startDate : '2021-01-09', duration : 2, durationUnit : 'day', name : 'dashed', eventStyle : 'dashed' },
        { resourceId : 1, startDate : '2021-01-12', duration : 2, durationUnit : 'day', name : 'minimal', eventStyle : 'minimal' },
        { resourceId : 1, startDate : '2021-01-12', duration : 2, durationUnit : 'day', name : 'rounded', eventStyle : 'rounded' }
    ],

    startDate : new Date(2021, 0, 3),
    endDate   : new Date(2021, 0, 14)
});
