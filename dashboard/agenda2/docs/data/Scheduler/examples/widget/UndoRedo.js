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
        { id : 1, name : 'Bernard' },
        { id : 2, name : 'Bianca' }
    ],

    events : [
        { id : 1, resourceId : 1, name : 'Interview', location : 'Office', startDate : '2018-05-07', endDate : '2018-05-10' },
        { id : 2, resourceId : 2, name : 'Meeting', location : 'Client\`s office', startDate : '2018-05-10', endDate : '2018-05-12' }
    ],

    // Add an undoredo widget to our top toolbar. It will seek the project of its owner.
    tbar : {
        items : {
            undoRedo : {
                type : 'undoredo'
            }
        }
    },

    startDate : new Date(2018, 4, 6),
    endDate   : new Date(2018, 4, 13),

    columns : [
        { field : 'name', text : 'Name', width : 100 }
    ]
});
