let grid = new Grid({
    appendTo : targetElement,

    autoHeight : true,

    data : DataGenerator.generateData(2),

    columns : [
        { field : 'firstName', text : 'First name' },
        { field : 'surName', text : 'Surname', hidden : true },
        { field : 'age', text : 'Age', align : 'right' },
        { field : 'city', text : 'City', editor : false }
    ]
});
