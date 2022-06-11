new Scheduler({
    appendTo : targetElement,
    height     : 400,
    width      : 600,

    // All Schedulers have a Project which encapsulates their data model
    // If we configure it with an STM, it enables undo/redo functionality.
    project : {
        stm : {
            autoRecord : true
        }
    },

    resources : [
        { id : 1, name : 'Arnold Smith', image : 'arnold.jpg' },
        { id : 2, name : 'Gloria Rogers', image : 'gloria.jpg', eventLayout : 'none' },
        { id : 3, name : 'Jane Miller', eventColor : 'indigo', image : false, eventLayout : 'none' }
    ],

    events : [
        { id : 1, resourceId : 1, name : 'Interview',       startDate : '2018-05-06T09:00', endDate : '2018-05-06T10:00' },
        { id : 2, resourceId : 1, name : 'Press meeting',   startDate : '2018-05-06T13:00', endDate : '2018-05-06T14:00' },
        { id : 3, resourceId : 2, name : 'Audition',        startDate : '2018-05-07T14:00', endDate : '2018-05-07T16:00' },
        { id : 5, resourceId : 3, name : 'Rehearsal',       startDate : '2018-05-07T16:00', endDate : '2018-05-07T20:00' },
        { id : 4, resourceId : 2, name : 'Script deadline', startDate : '2018-05-08T10:00', endDate : '2018-05-08T10:00' },
        { id : 6, resourceId : 3, name : 'Rehearsal #2',    startDate : '2018-05-08T16:00', endDate : '2018-05-08T19:00' }
    ],

    // Add an undoredo widget to our top toolbar. It will seek the project of its owner.
    tbar : {
        items : {
            gotoDate : {
                label     : 'Jump to',
                type      : 'datefield',
                value     : new Date(2018, 4, 6),
                picker    : {
                    events : 'count'
                },
                listeners : {
                    change : 'up.onDateSelected'
                }
            }
        }
    },

    viewPreset : {
        base      : 'hourAndDay',
        tickWidth : 50
    },
    startDate  : new Date(2018, 4, 6, 9),
    endDate    : new Date(2018, 4, 6, 22),

    columns : [
        { field : 'name', text : 'Name', width : 100 }
    ],

    onDateSelected({ value }) {
        value.setHours(9);
        this.startDate = value;
    }
});
