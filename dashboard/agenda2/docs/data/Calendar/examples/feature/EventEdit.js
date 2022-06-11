/* eslint-disable no-undef,no-unused-vars */
const calendar = new Calendar({
    appendTo : targetElement,
    height   : 700,

    // The utility panel which is at the left by default.
    // Not enough width here, so don't include it.
    sidebar : false,

    // Start life looking at this date
    date : '2020-03-01',

    // Used to create view titles
    dateFormat : 'DD MMM YYYY',

    // CrudManager arranges loading and syncing of data in JSON form from/to a web service
    crudManager : {
        transport : {
            load : {
                url : 'data/Calendar/examples/feature/company-events.json'
            }
        },
        autoLoad : true
    },

    // Features named by the properties are included.
    // An object is used to configure the feature.
    features : {
        eventEdit : {
            // items is the config for editor widgets. It is merged into provided editor items.
            // We may knock out a provided item using false.
            // We may alter the configuration of a provided item using an object.
            items : {
                // Hide the "All Day" checkbox for this application.
                allDay : null,

                // Field label "Owner" instead of "Calendar" which is the default
                resourceField : {
                    label : 'Owner'
                }
            }
        }
    },

    // Modes are the views available in the Calendar.
    // An object is used to configure the view.
    modes : {
        agenda : null,
        year   : null,
        week   : {
            dayStartTime : 8
        },
        day : {
            dayStartTime : 8
        }
    }
});
