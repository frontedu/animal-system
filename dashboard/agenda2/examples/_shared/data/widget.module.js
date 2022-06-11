window.introWidget = {
    type         : 'calendar',
    sidebar      : null,
    tbar         : null,
    title        : false,
    readOnly     : true,
    weekStartDay : 1,
    date         : '2021-10-11',
    forceFit     : true,
    features     : {
        eventTooltip : true
    },
    modes : {
        week : {
            dayStartTime     : 7,
            visibleStartTime : 8,
            allDayEvents     : {
                eventHeight : 22
            }
        },
        day    : null,
        month  : null,
        year   : null,
        agenda : null
    },
    resources : [
        {
            id         : 'bryntum',
            name       : 'Bryntum team',
            eventColor : '#249fbc'
        },
        {
            id         : 'hotel',
            name       : 'Hotel Park',
            eventColor : '#ffc107'
        },
        {
            id         : 'mats',
            name       : 'Mats Bryntse',
            eventColor : '#e44959'
        }
    ],
    events : [
        {
            id         : 1,
            startDate  : '2021-10-11T14:00:00',
            endDate    : '2021-10-11T18:00:00',
            name       : 'Check-In in Hotel',
            resourceId : 'hotel'
        },
        {
            id         : 2,
            startDate  : '2021-10-11T18:00:00',
            endDate    : '2021-10-11T20:00:00',
            name       : 'Relax and official arrival beer',
            allDay     : true,
            resourceId : 'mats'
        },
        {
            id         : 3,
            startDate  : '2021-10-11T20:00:00',
            endDate    : '2021-10-11T21:00:00',
            name       : 'Dinner',
            resourceId : 'hotel'
        },
        {
            id             : 4,
            startDate      : '2021-10-12T09:00:00',
            endDate        : '2021-10-12T10:00:00',
            name           : 'Breakfast',
            resourceId     : 'hotel',
            recurrenceRule : 'FREQ=DAILY;COUNT=6'
        },
        {
            id         : 5,
            startDate  : '2021-10-12T10:00:00',
            endDate    : '2021-10-12T12:00:00',
            name       : 'Team Scrum',
            resourceId : 'bryntum'
        },
        {
            id         : 6,
            startDate  : '2021-10-12T12:00:00',
            endDate    : '2021-10-12T14:00:00',
            name       : 'Scheduler Grid introduction + review',
            resourceId : 'bryntum'
        },
        {
            id             : 7,
            startDate      : '2021-10-12T14:00:00',
            endDate        : '2021-10-12T15:00:00',
            name           : 'Lunch',
            resourceId     : 'hotel',
            recurrenceRule : 'FREQ=DAILY;COUNT=5',
            exceptionDates : ['2021-10-14']
        },
        {
            id         : 8,
            startDate  : '2021-10-12T15:00:00',
            endDate    : '2021-10-12T19:00:00',
            name       : 'Active client project review',
            resourceId : 'bryntum'
        },
        {
            id         : 9,
            startDate  : '2021-10-12T19:00:00',
            endDate    : '2021-10-12T20:00:00',
            name       : 'Dinner',
            resourceId : 'hotel'
        },
        {
            id         : 10,
            startDate  : '2021-10-13T10:00:00',
            endDate    : '2021-10-13T12:00:00',
            name       : 'Roadmapping for 2020',
            resourceId : 'bryntum'
        },
        {
            id         : 11,
            startDate  : '2021-10-13T12:00:00',
            endDate    : '2021-10-13T14:00:00',
            name       : 'Review Assembla tickets and decide features to add',
            resourceId : 'bryntum'
        },
        {
            id         : 12,
            startDate  : '2021-10-13T15:00:00',
            endDate    : '2021-10-13T19:00:00',
            name       : 'Active programming',
            resourceId : 'bryntum'
        },
        {
            id         : 13,
            startDate  : '2021-10-13T19:00:00',
            endDate    : '2021-10-13T20:00:00',
            name       : 'Dinner',
            resourceId : 'hotel'
        },
        {
            id         : 14,
            startDate  : '2021-10-14T10:00:00',
            endDate    : '2021-10-14T18:00:00',
            name       : 'Excursion',
            resourceId : 'mats'
        },
        {
            id         : 15,
            startDate  : '2021-10-14T18:00:00',
            endDate    : '2021-10-14T22:00:00',
            name       : 'Team Building',
            resourceId : 'mats'
        },
        {
            id         : 16,
            startDate  : '2021-10-15T19:00:00',
            endDate    : '2021-10-15T20:00:00',
            name       : 'Dinner',
            resourceId : 'hotel'
        },
        {
            id         : 17,
            startDate  : '2021-10-15T00:00:00',
            endDate    : '2021-10-16T00:00:00',
            name       : 'Gantt review + development',
            allDay     : true,
            resourceId : 'bryntum'
        },
        {
            id         : 18,
            startDate  : '2021-10-16T18:00:00',
            endDate    : '2021-10-16T21:00:00',
            name       : 'Preso: Monitoring and Reproducing Errors in Web Applications',
            resourceId : 'mats'
        },
        {
            id         : 19,
            startDate  : '2021-10-16T00:00:00',
            endDate    : '2021-10-17T00:00:00',
            name       : 'Root Cause ticket bash',
            allDay     : true,
            resourceId : 'bryntum'
        },
        {
            id         : 20,
            startDate  : '2021-10-17T19:00:00',
            endDate    : '2021-10-17T20:00:00',
            name       : 'Dinner',
            resourceId : 'hotel'
        },
        {
            id         : 21,
            startDate  : '2021-10-17T00:00:00',
            endDate    : '2021-10-18T00:00:00',
            name       : 'Pair programming sessions',
            allDay     : true,
            resourceId : 'bryntum'
        },
        {
            id         : 22,
            startDate  : '2021-10-18T10:00:00',
            endDate    : '2021-10-18T12:00:00',
            name       : 'Check-Out & Fly home',
            resourceId : 'mats'
        }
    ]
};
