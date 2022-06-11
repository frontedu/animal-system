const dayView = new DayView({ 
    appendTo         : targetElement,
    height           : 500,
    startDate        : new Date(2020, 8, 2),
    endDate          : new Date(2020, 8, 7),
    dayStartTime     : 6,
    dayEndTime       : 19,
    visibleStartTime : 6,
    events           : [
        { startDate : '2020-09-02T00:00', duration : 5, durationUnit : 'd', name : 'Boss vacation', eventColor : 'red' },
        { startDate : '2020-09-02T07:00', duration : 5, durationUnit : 'h', name : 'Walk the dog', eventColor : 'yellow' },
        { startDate : '2020-09-03T09:00', duration : 2, durationUnit : 'h', name : 'Buy masks', eventColor : 'orange' },
        { startDate : '2020-09-04T07:00', duration : 1, durationUnit : 'h', name : 'Zoom meeting', eventColor : 'deep-orange' },
        { startDate : '2020-09-05T09:00', duration : 1, durationUnit : 'h', name : 'Get a haircut', eventColor : 'gray' }
    ],
    bbar : {
        items : {
            showAllDayHeader : {
                type    : 'checkbox',
                label   : 'Show all day header',
                checked : true,
                onChange({ checked }) {
                    dayView.showAllDayHeader = checked;
                }
            }
        }
    }
});
