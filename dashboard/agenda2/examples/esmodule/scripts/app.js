import { Calendar, TrialButton } from '../../../build/calendar.module.js';

new Calendar({
    minHeight : 525,

    // Start life looking at this date
    date : new Date(2020, 0, 27),

    // Don't show the view/time changing top toolbar
    // We are only showing a WeekView here
    tbar : null,

    // CrudManager arranges loading and syncing of data in JSON form from/to a web service
    crudManager : {
        transport : {
            load : {
                url : `data/data.json`
            }
        },
        autoLoad : true
    },

    // The utility panel which is at the left by default.
    // We can alter its items configuration.
    // Reconfigure to not show the datepicker
    sidebar : {
        items : {
            datePicker : null
        }
    },

    // Modes are the views available in the Calendar.
    // An object is used to configure the view.
    // Null disables, so we only allow the WeekView here
    modes : {
        agenda : null,
        year   : null,
        month  : null,
        day    : null,

        // Our day is from 7 to 7. Day columns start from this timepoint
        week : {
            dayStartTime : 7,
            dayEndTime   : 19
        }
    },

    // This element becomes the Calendar's encapsulating element
    appendTo : 'container'
});


new TrialButton({
    appendTo  : 'download-trial',
    cls       : 'b-green b-raised',
    productId : 'calendar'
});

