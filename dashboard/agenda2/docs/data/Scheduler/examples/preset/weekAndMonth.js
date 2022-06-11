const scheduler = new Scheduler({
    appendTo : targetElement,

    autoHeight : true,

    startDate : new Date(2018, 4, 15),
    endDate   : new Date(2018, 5, 14),

    viewPreset : 'weekAndMonth',

    columns : [
        { field : 'name', text : 'Name', width : 100 }
    ]
});
