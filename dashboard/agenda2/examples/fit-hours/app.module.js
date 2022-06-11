import { Calendar } from '../../build/calendar.module.js?459414';
import shared from '../_shared/shared.module.js?459414';

const calendar = new Calendar({
    appendTo : 'container',

    // Start life looking at this date
    date : new Date(2020, 9, 12),

    // CrudManager arranges loading and syncing of data in JSON form from/to a web service
    crudManager : {
        transport : {
            load : {
                url : 'data/data.json'
            }
        },
        autoLoad : true
    },

    // Modes are the views available in the Calendar.
    // An object may be used to configure the view.
    // null means do not include the view.
    modes : {
        agenda : null,
        month  : null,
        year   : null,
        day    : null,
        week   : {
            // Switch back to this when fitting hours is turned off
            hourHeight : 70,

            // This overrides any configured hour height.
            // The hourHeight will revert to configured value if set to false.
            fitHours : {
                // Odd is better for line rendering.
                // Avoids fractional pixels in background line generation.
                minHeight : 21
            },

            // These two settings decide what time span is rendered
            dayStartTime : 7,
            dayEndTime   : 18
        }
    },

    // The Calendar's top toolbar.
    // We can alter its items configuration.
    // In this case, we add a new UI item.
    tbar : {
        items : {
            fit : {
                text      : 'Fit timeline to available space',
                type      : 'checkbox',
                checked   : true,
                listeners : {
                    // 'up.' means method is on a parent Widget. It will find the Calendar
                    change : 'up.onCheckChange'
                }
            }
        }
    },

    // This is called when the 'Checkbox' field changes.
    onCheckChange({ value }) {
        // If set to false, the configured hourHeight will be used.
        this.activeView.fitHours = value;
    }
});
