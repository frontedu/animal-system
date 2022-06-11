import { Calendar } from '../../../build/thin/calendar.module.thin.js';

export class WeekCalendar extends Calendar {
    static $name = 'WeekCalendar';

    static type = 'weekcalendar';

    static configurable = {
        sidebar : false,
        modes   : {
            day    : null,
            year   : null,
            agenda : null,
            month  : null,
            week   : {
                dayStartTime : 7,
                dayEndTime   : 22,
                fitHours     : {
                    minHeight : 21
                },
                eventRenderer({ eventRecord, renderData }) {
                    switch (eventRecord.progress) {
                        case 'todo':
                            renderData.iconCls = 'b-icon b-fa-clock';
                            break;
                        case 'in-progress':
                            renderData.iconCls = 'b-icon b-fa-running';
                            break;
                        case 'done':
                            renderData.iconCls = 'b-icon b-fa-check';
                    }
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
    }
}

WeekCalendar.initClass();
