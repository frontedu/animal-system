'use strict';

var {
    Calendar
} = bryntum.calendar;
var today = new Date(),
    currentYear = today.getFullYear(),
    eventColors = ['#D50000', '#E67C73', '#F4511E', '#F6BF26', '#33B679', '#0B8043', '#039BE5', '#3F51B5', '#7986CB', '#8E24AA', '#616161'],
    eventNames = ['Quarterly Board Meeting', 'Development Meeting', 'Sales Dept Meeting', 'Interview with Julia', 'Interview with Naomi'],
    events = new Array(100000); // Create 100,000 events

for (var i = 0; i < 100000; i++) {
    var year = Math.round(Math.random() * (currentYear + 5 - currentYear) + currentYear),
        month = Math.round(Math.random() * 12),
        day = Math.round(Math.random() * 31),
        hour = Math.round(Math.random() * 8) + 4,
        durationHours = Math.round(Math.random() * 71) + 1;
    events[i] = {
        name       : eventNames[Math.round(Math.random() * 4)],
        startDate  : new Date(year, month, day, hour),
        endDate    : new Date(year, month, day, hour + durationHours),
        eventColor : eventColors[Math.round(Math.random() * 10)],
        resourceId : Math.round(Math.random() * 4)
    };
}

var calendar = new Calendar({
    appendTo : 'container',
    // Start life looking at this date
    date     : new Date(),
    modes    : {
        list : true
    },
    mode       : 'month',
    eventStore : {
        useRawData : true,
        data       : events
    }
});
