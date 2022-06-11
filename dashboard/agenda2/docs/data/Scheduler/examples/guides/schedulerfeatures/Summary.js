const scheduler = new Scheduler({
    appendTo : targetElement,

    autoHeight : true,
    rowHeight  : 40,
    barMargin  : 4,

    features : {
        summary : {
            renderer : ({ events }) => events.length || ''
        }
    },

    startDate : new Date(2018, 4, 6),
    endDate   : new Date(2018, 4, 13),

    columns : [
        { field : 'name', text : 'Name', width : 100 },
        {
            field           : 'rank',
            text            : 'Rank',
            width           : 100,
            sum             : 'sum',
            summaryRenderer : ({ sum }) => `Sum: ${sum}`
        }
    ],

    resourceStore : {
        fields : ['rank'],
        data   : [
            { id : 1, name : 'Bernard', rank : 5 },
            { id : 2, name : 'Bianca', rank : 4 },
            { id : 3, name : 'Belinda', rank : 3 }
        ]
    },

    events : [
        { id : 1, resourceId : 1, name : 'Drag around', startDate : '2018-05-07', endDate : '2018-05-10' },
        { id : 2, resourceId : 2, name : 'to update', startDate : '2018-05-08', endDate : '2018-05-12' },
        { id : 3, resourceId : 2, name : 'summaries', startDate : '2018-05-09', endDate : '2018-05-10' },
        { id : 4, resourceId : 3, name : 'below', startDate : '2018-05-09', endDate : '2018-05-10' }
    ]
});
