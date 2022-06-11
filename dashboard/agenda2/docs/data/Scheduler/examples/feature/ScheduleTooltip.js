targetElement.innerHTML = '<p>Hover an empty part of the schedule to display the ScheduleTooltip:</p>';
const scheduler = new Scheduler({
    appendTo : targetElement,

    features : {
        scheduleTooltip : {
            getText(date, event, resource) {

                return 'Hovering ' + resource.name;
            }
        }
    },

    // makes scheduler as high as it needs to be to fit rows
    autoHeight : true,

    startDate : new Date(2018, 4, 6),
    endDate   : new Date(2018, 4, 13),

    columns : [
        { field : 'name', text : 'Name', width : 100 }
    ],

    resources : [
        { id : 1, name : 'Bernard' },
        { id : 2, name : 'Bianca' }
    ],

    events : [
        { id : 1, resourceId : 1, name : 'Hover outside me', startDate : '2018-05-07', endDate : '2018-05-10', iconCls : 'b-fa b-fa-mouse-pointer' }
    ]
});
