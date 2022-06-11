'use strict';

var {
    Calendar
} = bryntum.calendar;
var calendar = new Calendar({
    appendTo    : 'container',
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
    // A block of configs which is applied to all modes.
    modeDefaults : {
        hourHeight       : 70,
        // These two settings decide what time span is rendered
        dayStartTime     : 4,
        dayEndTime       : 22,
        // Scroll to 7am initially
        visibleStartTime : 7,
        // Hours before 9am and after 5pm will be shaded grey.
        coreHours        : {
            start : 9,
            end   : 17
        }
    },
    sidebar : {
        items : {
            coreHoursOverlayDay : {
                weight   : 100,
                type     : 'checkbox',
                text     : 'Show core hours in day',
                // "up." means resolve in owner will call on the Calender
                onChange : 'up.onToggleCoreHoursInDay'
            },
            hourHeightSlider : {
                weight  : 110,
                value   : 70,
                min     : 20,
                max     : 100,
                text    : 'Hour height',
                type    : 'slider',
                // "up." means resolve in owner will call on the Calender
                onInput : 'up.onRowHeightChange'
            }
        }
    },
    // Modes are the views available in the Calendar.
    // An object may be used to configure the view.
    // null means do not include the view.
    modes : {
        agenda : null,
        month  : null,
        year   : null
    },
    // The Calendar's top toolbar.
    // We can alter its items configuration.
    // In this case, we add a new UI item.
    tbar : {
        items : {
            increment : {
                label     : 'Snap increment (minutes)',
                type      : 'numberfield',
                value     : 15,
                weight    : 600,
                step      : 5,
                min       : 5,
                max       : 60,
                width     : 250,
                listeners : {
                    // 'up.' means method is on a parent Widget. It will find the Calendar
                    change : 'up.onSnapIncrementChange'
                }
            },
            scrollHour : {
                cls       : 'hourField',
                label     : 'Scroll to hour',
                type      : 'numberfield',
                value     : 7,
                weight    : 650,
                min       : 4,
                max       : 21,
                listeners : {
                    // 'up.' means method is on a parent Widget. It will find the Calendar
                    change : 'up.onStartHourChange'
                }
            }
        }
    },

    // This is called when the 'Scroll to hour' field changes. Sync week view's state.
    onStartHourChange({
        value
    }) {
        this.activeView.scrollTo(value, {
            animate : true,
            block   : 'start'
        });
    },

    // This is called when the 'Snap increment' field changes.
    onSnapIncrementChange({
        value
    }) {
        this.activeView.increment = value * 1000 * 60;
    },

    onToggleCoreHoursInDay({
        checked
    }) {
        this.eachView(v => {
            if (v.coreHours) {
                v.coreHours.overlayDay = checked;
            }
        });
    },

    onRowHeightChange({
        value
    }) {
        calendar.eachView(v => v.hourHeight = value);
    }

});
