const grid = new Grid({
    appendTo : targetElement,

    height : 513,

    features : {
        cellEdit     : true,
        filter       : true,
        //group        : 'city',
        quickFind    : true,
        regionResize : true,
        stripe       : true
    },

    columns : [
        { text : 'Name', field : 'name', width : 140, locked : true },
        { text : 'City', field : 'city', width : 120, locked : true },
        {
            text   : 'Score',
            field  : 'score',
            width  : 80,
            sum    : true,
            editor : { type : 'number', min : 0, max : 100000 }
        },
        {
            type   : 'percent',
            text   : 'Percent done',
            field  : 'percent',
            editor : { type : 'number', min : 0, max : 100 },
            width  : 140
        },
        { text : 'Start', type : 'date', format : 'YYYY-MM-DD', field : 'start', width : 130 }
    ],

    data : DataGenerator.generateData(10)
});
