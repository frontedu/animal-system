targetElement.innerHTML = '<p>The config above gives this scheduler:</p>';

// scheduler with basic configuration
const scheduler = new Scheduler({
    appendTo   : targetElement,
    autoHeight : true,
    rowHeight  : 50,

    columns : [
        { text : 'Name', field : 'name', width : 160 }
    ],

    resources : [
        { id : 1, name : 'Dan Stevenson' },
        { id : 2, name : 'Talisha Babin' }
    ],

    events : [
        // the date format used is configurable, defaults to the simplified ISO format (e.g. 2017-10-05T14:48:00.000Z)
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toISOString
        { resourceId : 1, startDate : '2017-01-01', endDate : '2017-01-10' },
        { resourceId : 2, startDate : '2017-01-02', endDate : '2017-01-09' }
    ],

    startDate : new Date(2017, 0, 1),
    endDate   : new Date(2017, 0, 10)
});
