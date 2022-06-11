const scheduler = new Scheduler({
    appendTo : targetElement,

    autoHeight : true,

    resources : DataGenerator.generateData(2),
    startDate : new Date(2018, 0, 7),
    endDate   : new Date(2018, 0, 21),

    columns : [
        { field : 'name', text : 'Name', flex : 1 },
        { field : 'city', text : 'City', width : 80 }
    ]
});
