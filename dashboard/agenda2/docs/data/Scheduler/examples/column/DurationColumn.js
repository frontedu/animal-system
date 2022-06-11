const grid = new Grid({
    appendTo   : targetElement,
    autoHeight : true,
    width      : 400,
    columns    : [
        { field : 'name', text : 'Train route', width : 200, editor : false },
        { type : 'duration', text : 'Duration of journey', editor : false }
    ],

    store : {
        modelClass : EventModel,
        data       : [
            { id : 1, name : 'Stockholm -> Malmö', duration : 4.5, durationUnit : 'hour' },
            { id : 2, name : 'Lund -> Copenhagen', duration : 1, durationUnit : 'hour' },
            { id : 3, name : 'Gothenburg -> Stockholm', duration : 3, durationUnit : 'hour' }
        ]
    }
});
