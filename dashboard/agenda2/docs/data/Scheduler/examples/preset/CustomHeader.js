CSSHelper.insertRule('.customHeader .b-sch-header-timeaxis-cell { font-size:0.9em;border-left:1px solid rgb(160 160 160);border-bottom:1px solid rgb(160 160 160); font-weight:400;}');

new Scheduler({
    appendTo: targetElement,
    cls : 'customHeader',
    autoHeight: true,

    startDate: new Date(2022, 4, 1),
    endDate  : new Date(2022, 6, 1),
    resources : [
        { id : 1, name : 'Bob' },
        { id : 2, name : 'John' },
        { id : 3, name : 'Kate' },
        { id : 4, name : 'Lisa' },
    ],
    events : [
        { id : 1, resourceId : 1, startDate : new Date(2022, 4, 3), duration : 5, name : 'A cool task' }
    ],
    viewPreset: {
        timeResolution: {
            unit     : 'day',
            increment: 1
        },

        headers: [
            {
                unit      : 'month',
                dateFormat: 'MMM YYYY',
                align     : 'start'
            },
            {
                unit    : 'week',
                renderer: (startDate, endDate) => `Week ${DateHelper.format(startDate, 'WW')}`
            },
            {
                unit      : 'day',
                dateFormat: 'dd'
            },
            {
                unit      : 'day',
                dateFormat: 'DD'
            },
            {
                unit      : 'day',
                renderer : (startDate, endDate, headerConfig, index) => index % 4 === 0 ? Math.round(Math.random()* 5) : ''
            }
        ]
    },

    columns: [
        { field: 'name', text: 'Name', width: 100 }
    ]
});
