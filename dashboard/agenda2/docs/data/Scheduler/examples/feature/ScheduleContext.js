targetElement.innerHTML = '<p>Click on cells to select:</p>';

const scheduler = new Scheduler({
    appendTo : targetElement,

    features : {
        scheduleContext : true
    },

    // makes scheduler as high as it needs to be to fit rows
    autoHeight : true,

    startDate : new Date(2021, 1, 6),
    endDate   : new Date(2021, 1, 13),

    columns : [
        { field : 'name', text : 'Name', width : 100 }
    ],

    resources : [
        { id : 1, name : 'Bernard' },
        { id : 2, name : 'Bianca' }
    ],

    events : [
        { id : 1, resourceId : 1, name : 'Hover outside me', startDate : '2021-02-07', endDate : '2021-02-10', iconCls : 'b-fa b-fa-mouse-pointer' }
    ]
});
