const scheduler = new Scheduler({
    appendTo : targetElement,

    autoHeight : true,

    resources : DataGenerator.generateData(2),
    startDate : new Date(2018, 0, 7),
    endDate   : new Date(2018, 0, 21),

    columns : [
        { type : 'rownumber' },
        { text : 'Name', field : 'name', width : 130 },
        { type : 'number', text : 'Age', field : 'age', width : 80 }

    ]
});
