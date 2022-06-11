new Scheduler({
    appendTo : targetElement,

    autoHeight : true,

    startDate : new Date(2018, 4, 6),
    endDate   : new Date(2018, 4, 8),

    viewPreset : {
        timeResolution : {
            unit      : 'hour',
            increment : 1
        },

        headers : [
            {
                unit       : 'day',
                dateFormat : 'DD MMM YYYY'
            },
            {
                unit       : 'hour',
                dateFormat : 'hA'
            }
        ]
    },

    columns : [
        { field : 'name', text : 'Name', width : 100 }
    ]
});
