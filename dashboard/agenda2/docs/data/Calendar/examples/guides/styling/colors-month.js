new MonthView({
    startDate : new Date(2020, 8, 1),

    height : 400,

    appendTo : targetElement,

    title : null,

    events : [
        { startDate : '2020-09-01', duration : 2, durationUnit : 'h', name : 'red', eventColor : 'red' },
        { startDate : '2020-09-02', duration : 2, durationUnit : 'h', name : 'pink', eventColor : 'pink' },
        { startDate : '2020-09-03', duration : 2, durationUnit : 'h', name : 'purple', eventColor : 'purple' },
        { startDate : '2020-09-04', duration : 2, durationUnit : 'h', name : 'violet', eventColor : 'violet' },
        { startDate : '2020-09-05', duration : 2, durationUnit : 'h', name : 'indigo', eventColor : 'indigo' },
        { startDate : '2020-09-06', duration : 2, durationUnit : 'h', name : 'blue', eventColor : 'blue' },
        { startDate : '2020-09-07', duration : 2, durationUnit : 'h', name : 'cyan', eventColor : 'cyan' },
        { startDate : '2020-09-08', duration : 2, durationUnit : 'h', name : 'teal', eventColor : 'teal' },
        { startDate : '2020-09-09', duration : 2, durationUnit : 'h', name : 'green', eventColor : 'green' },
        { startDate : '2020-09-10', duration : 2, durationUnit : 'h', name : 'lime', eventColor : 'lime' },
        { startDate : '2020-09-11', duration : 2, durationUnit : 'h', name : 'yellow', eventColor : 'yellow' },
        { startDate : '2020-09-12', duration : 2, durationUnit : 'h', name : 'orange', eventColor : 'orange' },
        { startDate : '2020-09-13', duration : 2, durationUnit : 'h', name : 'deep-orange', eventColor : 'deep-orange' },
        { startDate : '2020-09-14', duration : 2, durationUnit : 'h', name : 'gray', eventColor : 'gray' }
    ]
});
