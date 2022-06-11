'use strict';

var {
    Calendar
} = bryntum.calendar;
var calendar = new Calendar({
    // Start life looking at this date
    date        : new Date(2020, 9, 12),
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
        eventTooltip : {
            // Because we're using a context menu with an active trigger action,
            // we show the tooltip on hover (default is on click).
            showOn : 'hover',
            // Configuration options are passed on to the tooltip instance.
            // Because we are using a context menu too, keep the tooltip
            // out of the way above the event (if possible - it will try
            // other orientations if there's not enough space there).
            align  : 'b-t'
        },
        scheduleMenu : true,
        eventMenu    : {
            items : {
                allDay : {
                    icon   : 'b-fa b-fa-calendar-day',
                    // Handler found by looking up ownership hierarchy.
                    // Will find an implementation in the Calendar
                    onItem : 'up.toggleAllDay'
                }
            },
            // Handler found by looking up ownership hierarchy.
            // Will find an implementation in the Calendar
            processItems : 'up.processContextMenuItems'
        }
    },

    processContextMenuItems({
        eventRecord,
        items
    }) {
        items.allDay.text = eventRecord.allDay ? 'Make intraday' : 'Make all day';
    },

    toggleAllDay({
        eventRecord
    }) {
        eventRecord.allDay = !eventRecord.allDay;
    }

});
