targetElement.innerHTML = '<p>A demo with a single basic group summary:</p>';
const scheduler = new Scheduler({
    appendTo : targetElement,

    // makes scheduler as high as it needs to be to fit rows
    autoHeight : true,

    features : {
        group        : 'company',
        groupSummary : {
            renderer : ({ events }) => events.length
        }
    },

    startDate : new Date(2018, 4, 6),
    endDate   : new Date(2018, 4, 13),

    columns : [
        { field : 'name', text : 'Name', width : 140 }
    ],

    resources : [
        { id : 1, name : 'Bernard', company : 'Company A' },
        { id : 2, name : 'Bianca', company : 'Company A' },
        { id : 3, name : 'Belinda', company : 'Company B' }
    ],

    events : [
        { id : 1, resourceId : 1, name : 'First', startDate : '2018-05-07', endDate : '2018-05-10' },
        { id : 2, resourceId : 2, name : 'Second', startDate : '2018-05-08', endDate : '2018-05-12' },
        { id : 3, resourceId : 2, name : 'Third', startDate : '2018-05-09', endDate : '2018-05-10' },
        { id : 4, resourceId : 3, name : 'Fourth', startDate : '2018-05-09', endDate : '2018-05-10' }
    ]
});
