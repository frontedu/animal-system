'use strict';

var {
    Calendar
} = bryntum.calendar;
var calendar = new Calendar({
    appendTo : 'container',
    // Start life looking at this date
    date     : new Date(2020, 9, 12),
    features : {
        weekExpander : true,
        // In our event editor, we'd like to match-any resource names
        // not just match from start.
        eventEdit    : {
            items : {
                resourceField : {
                    primaryFilter : {
                        operator : '*'
                    }
                }
            }
        }
    },
    // A block of configs which is applied to all modes.
    modeDefaults : {
    // Allows us to see details in a crowded day
        zoomOnMouseWheel : true
    },
    // List isn't included by default.
    // Include it using its default configuration.
    modes : {
        list : true
    },
    // Add a new item to the top toolbar.
    // Weight controls the order it is inserted at.
    tbar : {
        items : {
            autoRowHeight : {
                type     : 'checkbox',
                label    : 'Auto row height',
                weight   : 600,
                disabled : true,
                // "up." means resolve in owner will call on the Calender
                onChange : 'up.onAutoRowHeightChanged'
            }
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
    sidebar : {
        items : {
            // This is the "ref" of the new field
            resourceFilterFilter : {
                // Inserts just before the resourceFilter List
                weight               : 190,
                // Shows a clear trigger
                clearable            : true,
                label                : 'Filter resources',
                placeholder          : 'Filter resources',
                labelPosition        : 'above',
                type                 : 'textfield',
                keyStrokeChangeDelay : 100,
                // "up." means resolve in owner will call on the Calendar
                onChange             : 'up.onResourceFilterFilterChange'
            }
        }
    },

    // Called as the resourceFilterFilter's onChange handler
    onResourceFilterFilterChange({
        value
    }) {
    // A filter with an id replaces any previous filter with that id.
    // Leave any other filters which may be in use in place.
        this.widgetMap.resourceFilter.store.filter({
            id       : 'resourceFilterFilter',
            filterBy : r => r.name.toLowerCase().startsWith(value.toLowerCase()) // a function which returns true to include the record

        });
    },

    onActiveItemChange({
        activeItem
    }) {
    // Only meaningful if we are on the month view
        calendar.widgetMap.autoRowHeight.disabled = activeItem.modeName !== 'month';
    },

    // If it gets set programatically, sync the UI
    onAutoRowHeightChanged({
        checked
    }) {
        calendar.modes.month.autoRowHeight = checked;
    }

});
