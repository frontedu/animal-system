'use strict';

var {
    Calendar
} = bryntum.calendar;
var calendar = new Calendar({
    date        : new Date(2020, 0, 1),
    // CrudManager arranges loading and syncing of data in JSON form from/to a web service
    crudManager : {
        eventStore : {
            fields : [{
                name : 'room'
            }]
        },
        transport : {
            load : {
                url : 'data/data.json'
            }
        },
        autoLoad : true
    },
    appendTo : 'container',
    // The utility panel which is at the left by default.
    // There are no calendars to select, so don't include it.
    sidebar  : null,
    // Features named by the properties are included.
    // An object is used to configure the feature.
    features : {
        eventEdit : {
            // Any items configured on the eventEdit feature are merged into the items
            // definition of the default editor.
            // If a system-supplied name is used as a property, it will reconfigure that existing
            // field.
            // Configuring a system-supplied field as false removes that field.
            // If a new property name is used, it will be added to the editor.
            // Fields are sorted in ascending order of their weight config.
            // System-supplied input fields have weights from 100 to 800.
            // This new item is therefore inserted below the first existing field.
            items : {
                roomSelector : {
                    // The name means that it is bound the 'room' field
                    // of the event being edited.
                    name   : 'location',
                    type   : 'textfield',
                    label  : 'Location',
                    // Insert just after event name which is at 100
                    weight : 110
                },
                // Add a button to export the event in the editor window
                exportButton : {
                    type   : 'button',
                    icon   : 'b-fa b-fa-calendar-alt',
                    text   : 'Add to Outlook (.ics)',
                    weight : 900,

                    onClick() {
                        var eventRecord = calendar.features.eventEdit.eventRecord; // Add some custom ICS values (See https://tools.ietf.org/html/rfc5545 for more information)

                        eventRecord.exportToICS({
                            LOCATION : eventRecord.location
                        });
                    }

                }
            }
        }
    }
});
