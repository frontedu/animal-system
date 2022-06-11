const scheduler = new Scheduler({
    appendTo : targetElement,

    autoHeight : true,

    startDate : new Date(2018, 4, 1),
    endDate   : new Date(2018, 12, 31),

    viewPreset : 'monthAndYear',

    columns : [
        { field : 'name', text : 'Name', width : 100 }
    ]
});
