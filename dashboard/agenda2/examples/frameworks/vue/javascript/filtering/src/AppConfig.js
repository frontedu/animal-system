/**
 * Application configuration
 */
const calendarConfig = {
    crudManager: {
        autoLoad  : true,
        transport : {
            load: {
                url : 'data/data.json'
            }
        }
    },

    eventColor : null,

    eventEditFeature: {
        items: {
            location: {
                type    : 'text',
                name    : 'location',
                label   : 'Location',
                dataset : { eventType: 'Meeting' }
            }
        }
    },

    date : new Date(2020, 1, 6),

    // Modes are the views available in the Calendar.
    // An object is used to configure the view.
    modes: {
        year : false
    }
};

const findConfig = {
    icon                 : 'b-fa b-fa-filter',
    placeholder          : 'Find tasks by name',
    clearable            : true,
    keyStrokeChangeDelay : 100,
    width                : '13em',
    triggers             : {
        filter: {
            align : 'start',
            cls   : 'b-fa b-fa-filter'
        }
    }
};

const highlightConfig = {
    placeholder          : 'Highlight tasks',
    clearable            : true,
    keyStrokeChangeDelay : 100,
    triggers             : {
        filter: {
            align : 'start',
            cls   : 'b-fa b-fa-search'
        }
    }
};

export { calendarConfig, findConfig, highlightConfig };
