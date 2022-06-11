targetElement.innerHTML = '<p>This demo shows the red events first among other overlapping events:</p>';
const scheduler = new Scheduler({
    appendTo : targetElement,

    // makes scheduler as high as it needs to be to fit rows
    autoHeight : true,

    startDate : new Date(2018, 4, 6),
    endDate   : new Date(2018, 4, 13),

    viewPreset : 'dayAndWeek',

    columns : [
        { field : 'name', text : 'Name', width : 100 }
    ],

    resources : [
        { id : 1, name : 'Mark' }
    ],

    events : [
        { id : 1, resourceId : 1, name : '1. Call with a client', startDate : '2018-05-07', endDate : '2018-05-09', eventColor : 'green' },
        { id : 2, resourceId : 1, name : '2. Important meeting', startDate : '2018-05-07', endDate : '2018-05-09', eventColor : 'red' },
        { id : 3, resourceId : 1, name : '3. Audition', startDate : '2018-05-07', endDate : '2018-05-09', eventColor : 'green' }
    ],

    overlappingEventSorter(a, b) {
        const
            comparedNames  = a.name < b.name ? -1 : a.name === b.name ? 0 : 1,
            comparedColors = (a.eventColor === 'red' && b.eventColor !== 'red') ? -1 : (a.eventColor !== 'red' && b.eventColor === 'red') ? 1 : comparedNames;

        return a.startDateMS - b.startDateMS || a.endDateMS - b.endDateMS || comparedColors;
    }
});
