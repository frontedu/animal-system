const scheduler = new Scheduler({
    appendTo : targetElement,

    autoHeight : true,

    startDate : new Date(2018, 4, 6, 10, 0),
    endDate   : new Date(2018, 4, 6, 10, 2),

    viewPreset : 'secondAndMinute',

    columns : [
        { field : 'name', text : 'Name', width : 100 }
    ]
});
