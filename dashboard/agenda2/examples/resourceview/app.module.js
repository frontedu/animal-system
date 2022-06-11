import { Calendar, StringHelper } from '../../build/calendar.module.js?459414';
import shared from '../_shared/shared.module.js?459414';

const calendar = new Calendar({
    // Start life looking at this date
    date : new Date(2021, 9, 10),

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
            resourceFilter : {
                // Initially select resource IDs 2, 3 and 4
                selected : [2, 3, 4]
            }
        }
    },

    // Render to a DIV with this id
    appendTo : 'container',

    // Resource avatar images are loaded from this path
    resourceImagePath : '../_shared/images/users/',

    modes : {
        // Let's not show the default views
        day    : null,
        week   : null,
        month  : null,
        year   : null,
        agenda : null,

        // Mode name can be anything if it contains a "type" property.
        weekResources : {
            // Type has the final say over which view type is created
            type               : 'resource',
            title              : 'Week',
            // Specify how wide each resource panel should be
            resourceWidth      : '30em',
            hideNonWorkingDays : true,

            // This is a config object for the subviews
            view : {
                dayStartTime : 8,
                // Dock an additional widget at the end of the header
                strips       : {
                    // A simple widget showing location, temperature and a weather icon for each resource
                    resourceInfo : {
                        type : 'widget',
                        dock : 'header',
                        cls  : 'b-resource-location',
                        // This method gets called when the panel is created and we return some meta data about the
                        // resource, like weather and city
                        html() {
                            const resource = this.up('weekview').resource;

                            return StringHelper.xss`
                                <span class="weather">${resource.weather}</span>
                                <div class="location">
                                    <span class="city">${resource.city}</span>
                                    <span>${resource.temperature}F°</span>
                                </div>`;
                        }
                    }
                },
                // Show a close icon to filter out the resource
                tools : {
                    close : {
                        cls     : 'b-fa b-fa-times',
                        tooltip : 'Filter out this resource',
                        handler() {
                            const
                                calendar       = this.up('calendar'),
                                resourceFilter = calendar.widgetMap.resourceFilter,
                                resource       = this.resource;

                            resourceFilter.selected.remove(resource);
                        }
                    }
                }
            },

            // Info to display below a resource name
            meta : resource => resource.title
        },
        monthResources : {
            type               : 'resource',
            title              : 'Month',
            resourceWidth      : '30em',
            hideNonWorkingDays : true,

            view : {
                type : 'monthview'
            },

            meta : resource => resource.title
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
    },

    // The Calendar's top toolbar.
    // We can alter its items configuration.
    // In this case, we add some new UI items.
    tbar : {
        items : {
            label : {
                type   : 'label',
                text   : 'Resource width',
                weight : 630
            },
            // A slider controlling the width of each resource
            viewWidth : {
                type        : 'slider',
                weight      : 640,
                min         : 12,
                max         : 100,
                value       : 30,
                width       : 90,
                unit        : 'em',
                showValue   : false,
                showTooltip : true,
                onInput({ value }) {
                    calendar.activeView.resourceWidth = value + 'em';
                }
            },
            // Toggle non working days on / off
            toggleNonWorkingDays : {
                type    : 'checkbox',
                weight  : 650,
                label   : 'Nonworking days',
                checked : false,
                onChange({ checked }) {
                    calendar.modes.weekResources.hideNonWorkingDays = !checked;
                    calendar.modes.monthResources.hideNonWorkingDays = !checked;
                }
            }
        }
    }
});

window.calendar = calendar;
