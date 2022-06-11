const scheduler = new Scheduler({
    appendTo : targetElement,

    autoHeight : true,

    startDate : new Date(2018, 4, 6, 10),
    endDate   : new Date(2018, 4, 6, 14),

    viewPreset : 'minuteAndHour',

    columns : [
        { field : 'name', text : 'Name', width : 100 }
    ]
});
