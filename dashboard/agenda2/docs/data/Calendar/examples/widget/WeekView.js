new WeekView({
    appendTo     : targetElement,
    height       : 500,
    startDate    : new Date(2020, 8, 2),
    endDate      : new Date(2020, 8, 7),
    dayStartTime : 7,
    dayEndTime   : 16,
    events       : [
        { startDate : '2020-09-02T07:00', duration : 5, durationUnit : 'h', name : 'Walk the dog', eventColor : 'yellow' },
        { startDate : '2020-09-03T09:00', duration : 2, durationUnit : 'h', name : 'Buy masks', eventColor : 'orange' },
        { startDate : '2020-09-04T07:00', duration : 1, durationUnit : 'h', name : 'Zoom meeting', eventColor : 'deep-orange' },
        { startDate : '2020-09-05T09:00', duration : 1, durationUnit : 'h', name : 'Get a haircut', eventColor : 'gray' }
    ]
});
