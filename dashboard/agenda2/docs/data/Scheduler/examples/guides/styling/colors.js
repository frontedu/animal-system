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
        { id : 1, name : 'eventColor' }
    ],

    events : [
        { resourceId : 1, startDate : '2021-01-03', duration : 2, durationUnit : 'day', name : 'red', eventColor : 'red' },
        { resourceId : 1, startDate : '2021-01-04', duration : 2, durationUnit : 'day', name : 'pink', eventColor : 'pink' },
        { resourceId : 1, startDate : '2021-01-05', duration : 2, durationUnit : 'day', name : 'purple', eventColor : 'purple' },
        { resourceId : 1, startDate : '2021-01-06', duration : 2, durationUnit : 'day', name : 'violet', eventColor : 'violet' },
        { resourceId : 1, startDate : '2021-01-07', duration : 2, durationUnit : 'day', name : 'indigo', eventColor : 'indigo' },
        { resourceId : 1, startDate : '2021-01-08', duration : 2, durationUnit : 'day', name : 'blue', eventColor : 'blue' },
        { resourceId : 1, startDate : '2021-01-09', duration : 2, durationUnit : 'day', name : 'cyan', eventColor : 'cyan' },
        { resourceId : 1, startDate : '2021-01-10', duration : 2, durationUnit : 'day', name : 'teal', eventColor : 'teal' },
        { resourceId : 1, startDate : '2021-01-11', duration : 2, durationUnit : 'day', name : 'green', eventColor : 'green' },
        { resourceId : 1, startDate : '2021-01-12', duration : 2, durationUnit : 'day', name : 'lime', eventColor : 'lime' },
        { resourceId : 1, startDate : '2021-01-13', duration : 2, durationUnit : 'day', name : 'yellow', eventColor : 'yellow' },
        { resourceId : 1, startDate : '2021-01-14', duration : 2, durationUnit : 'day', name : 'orange', eventColor : 'orange' },
        { resourceId : 1, startDate : '2021-01-15', duration : 2, durationUnit : 'day', name : 'deep-orange', eventColor : 'deep-orange' },
        { resourceId : 1, startDate : '2021-01-16', duration : 2, durationUnit : 'day', name : 'gray', eventColor : 'gray' },
        { resourceId : 1, startDate : '2021-01-17', duration : 2, durationUnit : 'day', name : 'gantt-green', eventColor : 'gantt-green' }
    ],

    startDate : new Date(2021, 0, 3),
    endDate   : new Date(2021, 0, 19)
});
