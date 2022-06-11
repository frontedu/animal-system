import { Calendar } from '../../build/calendar.module.js?459414';
import shared from '../_shared/shared.module.js?459414';

const calendar = new Calendar({
    // CrudManager arranges loading and syncing of data in JSON form from/to a web service
    crudManager : {
        autoLoad  : true,
        transport : {
            load : {
                url : 'data/data.json'
            }
        }
    },

    appendTo : 'container',

    // Features named by the properties are included.
    // An object is used to configure the feature.
    features : {
        eventEdit : {
            items : {
                location : { type : 'text', name : 'location', label : 'Location', dataset : { eventType : 'Meeting' } }
            }
        }
    },

    // The utility panel which is at the left by default.
    // We can alter its items configuration.
    // Remove the default event filtering input field since this app provides its own.
    sidebar : {
        items : {
            eventFilter : false
        }
    },

    // Start life looking at this date
    date : new Date(2020, 1, 6),

    // Modes are the views available in the Calendar.
    // An object may be used to configure the view.
    // null means do not include the view.
    modes : {
        year : null
    },

    tbar : {
        items : {
            filterByName : {
                type                 : 'textfield',
                weight               : 650,
                icon                 : 'b-fa b-fa-filter',
                placeholder          : 'Find tasks by name',
                clearable            : true,
                keyStrokeChangeDelay : 100,
                triggers             : {
                    filter : {
                        align : 'start',
                        cls   : 'b-fa b-fa-filter'
                    }
                },
                onChange({ value }) {
                    // We filter using a RegExp, so quote significant characters
                    value = value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

                    // A filter with an id replaces any previous filter with that id.
                    // Leave any other filters which may be in use in place.
                    calendar.eventStore.filter({
                        id       : 'eventNameFilter',
                        filterBy : event => event.name.match(new RegExp(value, 'i'))
                    });
                }
            },
            highlight : {
                type                 : 'textfield',
                weight               : 660,
                placeholder          : 'Highlight tasks',
                clearable            : true,
                keyStrokeChangeDelay : 100,
                triggers             : {
                    filter : {
                        align : 'start',
                        cls   : 'b-fa b-fa-search'
                    }
                },
                onChange({ value }) {
                    value = value.toLowerCase();

                    // Loop through all events in the store
                    calendar.eventStore.forEach(task => {

                        // The cls field is a DomClassList with add and remove methods
                        if (value !== '' && task.name.toLowerCase().includes(value)) {
                            task.cls.add('b-match');
                        }
                        else {
                            task.cls.remove('b-match');
                        }
                    });

                    // Schedule a refresh of the UI now that we have updated all event UI classes.
                    calendar.refresh();

                    calendar.element.classList[value.length > 0 ? 'add' : 'remove']('b-highlighting');
                }
            }
        }
    }
});
