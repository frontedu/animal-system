const scheduler = new Scheduler({
    appendTo : targetElement,

    // This allows the timeline to be scrolled infinitely in time.
    infiniteScroll   : true,

    autoHeight : true,

    resources        :  [
        { id : 'r1', name : 'Mike', eventColor : 'red' },
        { id : 'r2', name : 'Linda', eventColor : 'indigo' }
    ],

    events : [
        { id : 1, resourceId : 'r1', startDate : new Date(), duration : 7, name : 'Scroll forever ➔'  }
    ],

    columns : [
        { text : 'Name', field : 'name', width : 130 }
    ]
});
