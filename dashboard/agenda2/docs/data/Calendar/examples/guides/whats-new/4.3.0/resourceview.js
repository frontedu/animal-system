const calendar = new Calendar({
    appendTo : targetElement,

    height  : 575,
    sidebar : false,

    tbar : {
        items : {
            todayButton     : null,
            viewDescription : {
                style : 'margin:0'
            }
        }
    },

    // Start life looking at this date
    date : new Date(2020, 9, 12),

    modes : {
        // Let's not show the default views
        day           : null,
        week          : null,
        month         : null,
        year          : null,
        agenda        : null,

        // Mode name can be anything if it contains a "type" property.
        weekResources : {
            // Type has the final say over which view type is created
            type  : 'resource',
            title : 'Week resources',

            // This is a config object for the subviews; one for each resource
            view  : {
                minWidth           : '23em',
                hideNonWorkingDays : true,
                dayStartTime       : 8
            }
        },
        monthResources : {
            type  : 'resource',
            title : 'Month resources',
            view  : {
                type               : 'monthview',
                minWidth           : '23em',
                hideNonWorkingDays : true,

                // Only needed for the doc example in a small containing element.
                overflowPopup      : {
                    constrainTo : targetElement.firstElementChild
                }
            }
        }
    },

    // Hardcoded inline data - use for POC only.
    // Use CrudManager in implementation.
    resources : [
        {
            "id"         : "bryntum",
            "name"       : "Bryntum team",
            "eventColor" : "blue"
        },
        {
            "id"         : "hotel",
            "name"       : "Hotel Park",
            "eventColor" : "orange"
        }
    ],
    events : [
        {
            "id"         : 1,
            "startDate"  : "2020-10-11T14:00:00",
            "endDate"    : "2020-10-18T12:00:00",
            "name"       : "Hackathon 2020",
            "allDay"     : true,
            "resourceId" : "bryntum"
        },
        {
            "id"         : 2,
            "startDate"  : "2020-10-11T14:00:00",
            "endDate"    : "2020-10-11T18:00:00",
            "name"       : "Check-In in Hotel",
            "resourceId" : "hotel"
        },
        {
            "id"         : 4,
            "startDate"  : "2020-10-11T20:00:00",
            "endDate"    : "2020-10-11T21:00:00",
            "name"       : "Dinner",
            "resourceId" : "hotel"
        },
        {
            "id"         : 5,
            "startDate"  : "2020-10-12T09:00:00",
            "endDate"    : "2020-10-12T10:00:00",
            "name"       : "Breakfast",
            "resourceId" : "hotel"
        },
        {
            "id"         : 6,
            "startDate"  : "2020-10-12T10:00:00",
            "endDate"    : "2020-10-12T12:00:00",
            "name"       : "Team Scrum",
            "resourceId" : "bryntum"
        },
        {
            "id"         : 7,
            "startDate"  : "2020-10-12T12:00:00",
            "endDate"    : "2020-10-12T14:00:00",
            "name"       : "Scheduler Grid introduction + review",
            "resourceId" : "bryntum"
        },
        {
            "id"         : 8,
            "startDate"  : "2020-10-12T14:00:00",
            "endDate"    : "2020-10-12T15:00:00",
            "name"       : "Lunch",
            "resourceId" : "hotel"
        },
        {
            "id"         : 9,
            "startDate"  : "2020-10-12T15:00:00",
            "endDate"    : "2020-10-12T19:00:00",
            "name"       : "Active client project review",
            "resourceId" : "bryntum"
        },
        {
            "id"         : 10,
            "startDate"  : "2020-10-12T19:00:00",
            "endDate"    : "2020-10-12T20:00:00",
            "name"       : "Dinner",
            "resourceId" : "hotel"
        },
        {
            "id"         : 11,
            "startDate"  : "2020-10-13T09:00:00",
            "endDate"    : "2020-10-13T10:00:00",
            "name"       : "Breakfast",
            "resourceId" : "hotel"
        },
        {
            "id"         : 12,
            "startDate"  : "2020-10-13T10:00:00",
            "endDate"    : "2020-10-13T12:00:00",
            "name"       : "Roadmapping for 2020",
            "resourceId" : "bryntum"
        },
        {
            "id"         : 13,
            "startDate"  : "2020-10-13T12:00:00",
            "endDate"    : "2020-10-13T14:00:00",
            "name"       : "Review Assembla tickets and decide features to add",
            "resourceId" : "bryntum"
        },
        {
            "id"         : 14,
            "startDate"  : "2020-10-13T14:00:00",
            "endDate"    : "2020-10-13T15:00:00",
            "name"       : "Lunch",
            "resourceId" : "hotel"
        },
        {
            "id"         : 15,
            "startDate"  : "2020-10-13T15:00:00",
            "endDate"    : "2020-10-13T19:00:00",
            "name"       : "Active programming",
            "resourceId" : "bryntum"
        },
        {
            "id"         : 16,
            "startDate"  : "2020-10-13T19:00:00",
            "endDate"    : "2020-10-13T20:00:00",
            "name"       : "Dinner",
            "resourceId" : "hotel"
        },
        {
            "id"         : 17,
            "startDate"  : "2020-10-14T09:00:00",
            "endDate"    : "2020-10-14T10:00:00",
            "name"       : "Breakfast",
            "resourceId" : "hotel"
        },
        {
            "id"         : 20,
            "startDate"  : "2020-10-15T09:00:00",
            "endDate"    : "2020-10-15T10:00:00",
            "name"       : "Breakfast",
            "resourceId" : "hotel"
        },
        {
            "id"         : 21,
            "startDate"  : "2020-10-15T14:00:00",
            "endDate"    : "2020-10-15T15:00:00",
            "name"       : "Lunch",
            "resourceId" : "hotel"
        },
        {
            "id"         : 22,
            "startDate"  : "2020-10-15T19:00:00",
            "endDate"    : "2020-10-15T20:00:00",
            "name"       : "Dinner",
            "resourceId" : "hotel"
        },
        {
            "id"         : 23,
            "startDate"  : "2020-10-15T00:00:00",
            "endDate"    : "2020-10-16T00:00:00",
            "name"       : "Gantt review + development",
            "allDay"     : true,
            "resourceId" : "bryntum"
        },
        {
            "id"         : 24,
            "startDate"  : "2020-10-16T09:00:00",
            "endDate"    : "2020-10-16T10:00:00",
            "name"       : "Breakfast",
            "resourceId" : "hotel"
        },
        {
            "id"         : 25,
            "startDate"  : "2020-10-16T14:00:00",
            "endDate"    : "2020-10-16T15:00:00",
            "name"       : "Lunch",
            "resourceId" : "hotel"
        },
        {
            "id"         : 27,
            "startDate"  : "2020-10-16T00:00:00",
            "endDate"    : "2020-10-17T00:00:00",
            "name"       : "Root Cause ticket bash",
            "allDay"     : true,
            "resourceId" : "bryntum"
        },
        {
            "id"         : 28,
            "startDate"  : "2020-10-17T09:00:00",
            "endDate"    : "2020-10-17T10:00:00",
            "name"       : "Breakfast",
            "resourceId" : "hotel"
        },
        {
            "id"         : 29,
            "startDate"  : "2020-10-17T14:00:00",
            "endDate"    : "2020-10-17T15:00:00",
            "name"       : "Lunch",
            "resourceId" : "hotel"
        },
        {
            "id"         : 30,
            "startDate"  : "2020-10-17T19:00:00",
            "endDate"    : "2020-10-17T20:00:00",
            "name"       : "Dinner",
            "resourceId" : "hotel"
        },
        {
            "id"         : 31,
            "startDate"  : "2020-10-17T00:00:00",
            "endDate"    : "2020-10-18T00:00:00",
            "name"       : "Pair programming sessions",
            "allDay"     : true,
            "resourceId" : "bryntum"
        },
        {
            "id"         : 32,
            "startDate"  : "2020-10-18T09:00:00",
            "endDate"    : "2020-10-18T10:00:00",
            "name"       : "Breakfast",
            "resourceId" : "hotel"
        }
    ]
});
