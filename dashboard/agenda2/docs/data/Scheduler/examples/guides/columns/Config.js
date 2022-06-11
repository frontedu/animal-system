const scheduler = new Scheduler({
    appendTo : targetElement,

    autoHeight : true,

    resources : DataGenerator.generateData(2),
    startDate : new Date(2018, 0, 7),
    endDate   : new Date(2018, 0, 21),

    columns : [
        { field : 'firstName', text : 'First name' },
        { field : 'surName', text : 'Surname', hidden : true },
        { field : 'age', text : 'Age', align : 'right' },
        { field : 'city', text : 'City', editor : false }
    ]
});
