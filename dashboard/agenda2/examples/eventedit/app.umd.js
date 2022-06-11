'use strict';

var {
    Model,
    Combo,
    AjaxStore,
    Calendar,
    DateHelper,
    StringHelper
} = bryntum.calendar;

class Room extends Model {
    static get fields() {
        return [{
            name : 'name'
        }, {
            name : 'capacity',
            type : 'number'
        }];
    }

}

var roomStore = new AjaxStore({
    readUrl    : 'data/rooms.json',
    autoLoad   : true,
    modelClass : Room
});

class RoomSelector extends Combo {
    static get type() {
        return 'roomSelector';
    }

    static get configurable() {
        return {
            store        : roomStore,
            displayField : 'name'
        };
    }

} // Register this type with its factory

RoomSelector.initClass();
var calendar = new Calendar({
    // CrudManager arranges loading and syncing of data in JSON form from/to a web service
    crudManager : {
        eventStore : {
            fields : [{
                name : 'room'
            }, {
                name : 'rsvp'
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
        eventTooltip : {
            // Configuration options are passed on to the tooltip instance
            // We want the tooltip's left edge aligned to the right edge of the event if possible.
            align : 'l-r'
        },
        eventEdit : {
            // We like our editor to be modal and centered, not aligned to any event.
            editorConfig : {
                modal         : true,
                centered      : true,
                anchor        : null,
                // 'up.' means method is on a parent Widget. It will find the Calendar
                titleRenderer : 'up.makeEditorTitle'
            },
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
                    name     : 'room',
                    type     : 'roomSelector',
                    label    : 'Room',
                    // This just means no typing.
                    // Always use point and click.
                    // Avoid intrusive keyboard on touch screens where possible.
                    editable : false,
                    // Insert just after event name which is at 100
                    weight   : 110
                },
                rsvp : {
                    type    : 'radiogroup',
                    label   : 'Response',
                    name    : 'rsvp',
                    // Insert just before start time which is at 300
                    weight  : 290,
                    options : {
                        accept    : 'Accepted',
                        decline   : 'Declined',
                        tentative : 'Tentative'
                    }
                },
                // Don't render the resource (calendar) selection input.
                // We're only ever using the "bryntum" calendar.
                resourceField : null
            }
        }
    },
    // Modes are the views available in the Calendar.
    // An object may be used to configure the view.
    // null means do not include the view.
    modes : {
        agenda : null,
        year   : null,
        week   : null,
        day    : null
    },

    // Referenced by the editorConfig of the eventEdit Feature
    makeEditorTitle(eventRecord) {
        return StringHelper.xss`${DateHelper.format(eventRecord.startDate, 'HH:mm')} - ${DateHelper.format(eventRecord.endDate, 'HH:mm')} ${eventRecord.name}`;
    }

});
