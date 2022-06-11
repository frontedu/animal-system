import { Calendar } from '../../build/calendar.module.js?459414';
import shared from '../_shared/shared.module.js?459414';

const calendar = new Calendar({
    appendTo : 'container',

    // Start life looking at this date
    date : new Date(2020, 9, 12),

    modes : {
        // The "midnight shift" (24-hours starts at 6PM instead of 12AM):
        // Override the default of making 7am the top visible time in Day views
        day : {
            dayStartShift    : 18,
            visibleStartTime : 18
        },
        week : {
            dayStartShift    : 18,
            visibleStartTime : 18
        }
    },

    // CrudManager arranges loading and syncing of data in JSON form from/to a web service
    crudManager : {
        autoLoad  : true,
        transport : {
            load : {
                url : 'data/data.json'
            }
        }
    },

    // Features named by the properties are included.
    // An object is used to configure the feature.
    features : {
        eventTooltip : {
            // Configuration options are passed on to the tooltip instance
            // We want the tooltip's left edge aligned to the right edge of the event if possible.
            align : 'l-r'
        }
    }
});
