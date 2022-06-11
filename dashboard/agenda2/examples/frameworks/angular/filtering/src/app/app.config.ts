/**
 * Application config file
 */

export const calendarConfig = {
    // CrudManager arranges loading and syncing of data in JSON form from/to a web service
    crudManager : {
        autoLoad  : true,
        transport : {
            load : {
                url : 'assets/data/data.json'
            }
        }
    },

    // Features named by the properties are included.
    // An object is used to configure the feature.
    features : {
        eventEdit : {
            items : {
                location : {
                    type    : 'text',
                    name    : 'location',
                    label   : 'Location',
                    dataset : { eventType : 'Meeting' }
                }
            }
        }
    },

    date : new Date(2020, 1, 6),

    // Modes are the views available in the Calendar.
    // An object is used to configure the view.
    modes : {
        year : false
    }
};
