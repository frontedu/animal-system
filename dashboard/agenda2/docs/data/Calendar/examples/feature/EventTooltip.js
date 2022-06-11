/* eslint-disable no-undef,no-unused-vars */
const calendar = new Calendar({
    appendTo : targetElement,
    height   : 700,
    // The utility panel which is at the left by default.
    // Not enough width here, so don't include it.
    sidebar  : false,

    // Start life looking at this date
    date : '2020-03-01',

    // Used to create view titles
    dateFormat : 'DD MMM YYYY',

    // CrudManager arranges loading and syncing of data in JSON form from/to a web service
    crudManager : {
        transport : {
            load : {
                url : 'data/Calendar/examples/feature/company-events.json'
            }
        },
        autoLoad : true
    },

    // Features named by the properties are included.
    // An object is used to configure the feature.
    features : {
        eventTooltip : {
            // Configuration options are passed on to the tooltip instance.
            // Override the default which is to show on click.
            showOn : 'hover',

            // Create content for Tooltip header
            titleRenderer : eventRecord => eventRecord.description,

            tools : {
                // Add a new tool for our own operation
                newTool : {
                    cls     : 'b-icon-add',
                    tooltip : 'Test',
                    // 'up.' means look in owning widgets.
                    // Implemented on the Calendar
                    handler : 'up.onTooltipAddClick'
                }
            }
        }
    },

    // Tooltip's Tool handler resolved here
    onTooltipAddClick(e, tooltip) {
        MessageDialog.alert({
            title   : 'Tooltip tool clicked',
            message : `Test ${tooltip.eventRecord.name}`
        });
    },

    // Modes are the views available in the Calendar.
    // An object is used to configure the view.
    modes : {
        agenda : null,
        year   : null,
        week   : {
            dayStartTime : 8
        },
        day : {
            dayStartTime : 8
        }
    }
});
