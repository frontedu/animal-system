let grid = new Grid({
    appendTo : targetElement,

    autoHeight : true,

    data : DataGenerator.generateData(2),

    columns : [
        { type : 'rownumber' },
        { type : 'check', text : 'CheckColumn', field : 'done', flex : 1 },
        { type : 'date', text : 'DateColumn', field : 'start', flex : 1 },
        { type : 'number', text : 'NumberColumn', field : 'rank', flex : 1 },
        { type : 'percent', text : 'PercentColumn', field : 'percent', flex : 1 },
        { type : 'rating', text : 'RatingColumn', field : 'rating', flex : 1 },
        { type : 'template', text : 'TemplateColumn', field : 'city', flex : 1, template : ({value}) => `Lives in ${value}`},
        { type : 'widget', text : 'Widget', field : 'color', flex : 1, widgets : [ { type: 'button', cls: 'b-raised b-orange' }] }
    ]
});
