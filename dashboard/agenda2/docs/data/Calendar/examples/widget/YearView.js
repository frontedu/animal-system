new YearView({
    appendTo  : targetElement,
    height    : 500,
    startDate : new Date(2021, 0, 1),
    events    : [
        { startDate : '2021-01-02T07:00', duration : 5, durationUnit : 'h', name : 'Walk the dog', eventColor : 'yellow' },
        { startDate : '2021-02-03T09:00', duration : 2, durationUnit : 'h', name : 'Buy masks', eventColor : 'orange' },
        { startDate : '2021-03-04T07:00', duration : 1, durationUnit : 'h', name : 'Zoom meeting', eventColor : 'deep-orange' },
        { startDate : '2021-04-05T09:00', duration : 1, durationUnit : 'h', name : 'Get a haircut', eventColor : 'gray' }
    ]
});
