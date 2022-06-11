let grid = new Grid({
    appendTo : targetElement,

    autoHeight : true,

    data : DataGenerator.generateData(2),

    columns : [
        { field : 'name', text : 'Name', flex : 1 },
        { field : 'city', text : 'City', width : 100 }
    ]
});
