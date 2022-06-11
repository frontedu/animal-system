import { Calendar } from '../../build/calendar.module.js?459414';
import shared from '../_shared/shared.module.js?459414';

const calendar = new Calendar({
    // Start life looking at this date
    date : new Date(2020, 9, 12),

    tbar : {
        items : {
            print : {
                type    : 'button',
                text    : 'Print',
                color   : 'b-orange b-raised',
                icon    : 'b-fa b-fa-print',
                cls     : 'b-print-button',
                tooltip : 'Print the currently active view',
                // "up" means it is resolved on an ancestor. Will find on the Calendar
                onClick : 'up.print'
            }
        }
    },

    // Modes are the views available in the Calendar.
    // An object may be used to configure the view.
    // null means do not include the view.
    modes : {
        day : {
            // These two settings decide what time span is rendered.
            dayStartTime : 6,
            dayEndTime   : 22
        },
        week : {
            dayStartTime : 6,
            dayEndTime   : 22
        }
    },

    // CrudManager arranges loading and syncing of data in JSON form from/to a web service
    crudManager : {
        transport : {
            load : {
                url : 'data/data.json'
            }
        },
        autoLoad : true
    },

    appendTo : 'container',

    // Features named by the properties are included.
    // An object is used to configure the feature.
    features : {
        print        : true,
        eventTooltip : {
            // Configuration options are passed on to the tooltip instance
            // We want the tooltip's left edge aligned to the right edge of the event if possible.
            align : 'l-r'
        }
    }
});
