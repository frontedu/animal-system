targetElement.innerHTML = '<p>Double click an event to show the simple editor, or double click the empty schedule area to create a new event:</p>';
const scheduler = new Scheduler({
    appendTo : targetElement,

    // makes scheduler as high as it needs to be to fit rows
    autoHeight : true,

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
        { id : 1, resourceId : 1, name : 'Double click me', startDate : '2018-05-08', endDate : '2018-05-11' }
    ],

    features : {
        eventEdit       : false,
        simpleEventEdit : true
    }
});
