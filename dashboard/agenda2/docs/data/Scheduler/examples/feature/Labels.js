targetElement.innerHTML = '<p>Demo displaying top and bottom labels with top label; editable on <code>dblclick</code>:</p>';

const scheduler = new Scheduler({
    appendTo : targetElement,

    // makes scheduler as high as it needs to be to fit rows
    autoHeight : true,
    barMargin  : 5,
    rowHeight  : 70,

    features : {
        labels : {
            top : {
                field  : 'location',
                editor : {
                    type : 'textfield'
                }
            },
            bottom : {
                renderer : ({ eventRecord }) => `ID: ${eventRecord.id}`
            }
        }
    },

    startDate : new Date(2018, 4, 6),
    endDate   : new Date(2018, 4, 13),

    columns : [
        { field : 'name', text : 'Name', width : 100 }
    ],

    resources : [
        { id : 1, name : 'Bernard' },
        { id : 2, name : 'Bianca' }
    ],

    events : [
        { id : 1, resourceId : 1, name : 'Interview', location : 'Office', startDate : '2018-05-07', endDate : '2018-05-10' },
        { id : 2, resourceId : 2, name : 'Meeting', location : 'Client\`s office', startDate : '2018-05-10', endDate : '2018-05-12' }
    ]
});
