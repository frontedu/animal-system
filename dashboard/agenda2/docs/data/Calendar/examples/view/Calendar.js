const
    calendar        = new Calendar({
        appendTo : targetElement,
        height   : 700,

        tbar : {
            items : {
                todayButton : null
            }
        },

        // The utility panel which is at the left by default.
        // Not enough width here, so don't include it.
        sidebar : false,

        // Save some width
        hideNonWorkingDays : true,

        // Start life looking at this date
        date : '2020-10-11',

        // Used to create view titles
        dateFormat : 'DD MMM YYYY',

        // CrudManager arranges loading and syncing of data in JSON form from/to a web service
        crudManager : {
            transport : {
                load : {
                    url : 'data/Calendar/examples/view/data.json'
                }
            },
            autoLoad : true
        },

        // Modes are the views available in the Calendar.
        // An object is used to configure the view.
        modes : {
            // Let's not show single day view
            day  : null,
            week : {
                dayStartTime : 8
            }
        }
    });
