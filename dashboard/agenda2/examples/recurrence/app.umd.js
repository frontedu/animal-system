'use strict';

var {
    Calendar
} = bryntum.calendar;
var calendar = new Calendar({
    // CrudManager arranges loading and syncing of data in JSON form from/to a web service
    crudManager : {
        eventStore : {
            fields : [{
                name : 'room'
            }]
        },
        transport : {
            load : {
                url : 'data/data.json'
            }
        },
        autoLoad : true
    },
    appendTo : 'container',
    // The utility panel which is at the left by default.
    // There are no calendars to select, so don't include it.
    sidebar  : null,
    // Modes are the views available in the Calendar.
    // An object may be used to configure the view.
    // null means do not include the view.
    modes    : {
        agenda : null,
        year   : null,
        week   : null,
        day    : null
    }
});
