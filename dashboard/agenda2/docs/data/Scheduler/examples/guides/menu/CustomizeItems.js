const scheduler = new Scheduler({
    appendTo : targetElement,

    autoHeight : true,
    rowHeight  : 40,
    barMargin  : 4,

    startDate : new Date(2018, 4, 6),
    endDate   : new Date(2018, 4, 13),

    viewPreset : {
        base            : 'dayAndWeek',
        timeColumnWidth : 30
    },

    columns : [
        { field : 'name', text : 'Name', width : 100 }
    ],

    resources : [
        { id : 1, name : 'Bernard' },
        { id : 2, name : 'Bianca' }
    ],

    events : [
        { id : 1, resourceId : 1, name : 'Right click the header of the timeaxis', startDate : '2018-05-07', endDate : '2018-05-12' }
    ],

    features : {
        timeAxisHeaderMenu : {
            items : {
                // Rename and move "Date range" item to be above "Zoom" item (200)
                dateRange : {
                    text   : 'Start/End',
                    weight : 190
                }
            }
        }
    }
});
