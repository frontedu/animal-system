const scheduler = new Scheduler({
    appendTo : targetElement,

    autoHeight : true,

    startDate : new Date(2018, 0, 1),
    endDate   : new Date(2019, 11, 31),

    viewPreset : 'year',

    columns : [
        { field : 'name', text : 'Name', width : 100 }
    ]
});
