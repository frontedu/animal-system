const calendar = new Calendar({
    appendTo : targetElement,

    height : 400,
    sidebar : false,

    modes : {
        // The "midnight shift" (24-hours starts at 6PM instead of 12AM):
        day  : {
            dayStartShift : 18
        },
        week : {
            dayStartShift : 18
        },

        agenda : false,
        month  : false,
        year   : false
    },

    // Hardcoded inline data - use for POC only.
    // Use CrudManager in implementation.
    resources : [
        { id : 1, name : 'Worker' }
    ],
    events : [
        { resourceId : 1, startDate : new Date(), duration : 3, durationUnit : 'h', name : 'Meeting' }
    ],
});
