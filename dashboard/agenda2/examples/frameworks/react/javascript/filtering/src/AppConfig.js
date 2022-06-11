/**
 * Application configuration
 */
const calendarConfig = {
    // CrudManager arranges loading and syncing of data in JSON form from/to a web service
    crudManager: {
        autoLoad: true,
        transport: {
            load: {
                url: 'data/data.json'
            }
        }
    },
    eventColor: null,
    eventEditFeature: {
        items: {
            location: {
                type: 'text',
                name: 'location',
                label: 'Location',
                dataset: { eventType: 'Meeting' }
            }
        }
    },
    date: new Date(2020, 1, 6),
    // Modes are the views available in the Calendar.
    // An object is used to configure the view.
    modes: {
        year: false
    }
};

const filterConfig = {
    placeholder: 'Find tasks by name',
    keyStrokeChangeDelay: 80,
    clearable: true,
    width: '12.5em',
    triggers: {
        filter: {
            align: 'start',
            cls: 'b-fa b-fa-filter'
        }
    }
};
const highlightConfig = {
    placeholder: 'Highlight tasks',
    keyStrokeChangeDelay: 80,
    clearable: true,
    width: '12.5em',
    triggers: {
        filter: {
            align: 'start',
            cls: 'b-fa b-fa-search'
        }
    }
};

export { calendarConfig, filterConfig, highlightConfig };
