import { Calendar } from '../../build/calendar.module.js?459414';
import shared from '../_shared/shared.module.js?459414';

const calendar = new Calendar({
    appendTo : 'container',

    // Start life looking at this date
    date : new Date(2022, 8, 12),

    crudManager : {
        transport : {
            load : {
                url : 'data/data.json'
            }
        },
        eventStore : {
            syncDataOnLoad : true
        },
        resourceStore : {
            syncDataOnLoad : true
        },
        autoLoad  : true,
        listeners : {
            load() {
                const { resourceFilter, showUnassigned } = calendar.widgetMap;

                // Populate our resourceFilter with the resources available
                resourceFilter.store = calendar.resourceStore;
                resourceFilter.value = [resourceFilter.store.getById('hotel')];
                // Our custom resource filter.
                // We consult the resourceFilter and the showUnassigned switch.
                calendar.resourceFilter = calendar.eventStore.addFilter({
                    id       : 'custom-filter',
                    filterBy : event => event.resourceId ? resourceFilter.valueCollection.includes(event.resourceId) : showUnassigned.checked
                });
            },
            prio : 1000,
            once : true
        }
    },

    tbar : {
        items : {
            reload : {
                text    : 'Reload',
                weight  : 650,
                onClick : 'up.reloadData'
            }
        }
    },

    modes : {
        day : {
            showAllDayHeader : false
        },
        week : {
            showAllDayHeader : false
        },
        year     : null,
        agenda   : null,
        resource : true
    },

    sidebar : {
        // Constrain our resourceFilter which doesn't wrap its chips
        width : 250,

        items : {
            eventFilter : null,

            // Date picker collapses into its header when collapsible is true
            datePicker : {
                title       : 'Month Navigation',
                collapsible : true
            },

            showUnassigned : {
                weight : 150,
                type   : 'slidetoggle',
                label  : 'Show unassigned',

                // "up." means resolve in owner will call on the Calender
                onChange : 'up.onFilterCriteriaChange'
            },

            // Override the default one.
            resourceFilter : {
                type        : 'combo',
                multiSelect : true,
                listCls     : 'custom-resource-filter',
                // The value is the records selected
                valueField  : null,

                // What narrowing by typing works on
                displayField : 'name',

                // Show the list fixed below
                inlinePicker : true,
                listItemTpl  : resource => `
                    <div class="resource-list-text">
                        <div class="resource-name">${resource.name}</div>
                        <div class="resource-type">${resource.type}</div>
                    </div>
                `,

                // "up." means resolve in owner will call on the Calendar
                onChange : 'up.onFilterCriteriaChange',

                // We want the ChipView to scroll horizontally with no wrapping.
                chipView : {
                    itemTpl    : resource => `${resource.name}`,
                    scrollable : {
                        overflowX : 'hidden-scroll',
                        overflowY : false
                    },
                    style : {
                        flexWrap : 'nowrap'
                    }
                }
            }
        }
    },

    // Called as the showUnassigned and resourceFilterFilter onChange handler
    onFilterCriteriaChange() {
        if (calendar.resourceFilter) {
            calendar.resourceFilter.disabled = false;

            // No params means just re-evaluate the filter.
            this.eventStore.filter();
        }
    },

    reloadData() {
        calendar.setConfig({
            events : [
                {
                    id         : 1,
                    startDate  : '2022-09-11T14:00:00',
                    endDate    : '2022-09-18T12:00:00',
                    name       : 'Developer Conference 2022',
                    allDay     : true,
                    resourceId : 'apple',
                    eventColor : 'green'
                },
                {
                    id         : 2,
                    startDate  : '2022-09-11T14:00:00',
                    endDate    : '2022-09-11T18:00:00',
                    name       : 'Check-In in Hotel',
                    resourceId : 'hotel'
                },
                {
                    id        : 3,
                    startDate : '2022-09-11T18:00:00',
                    endDate   : '2022-09-11T20:00:00',
                    name      : 'Relax and official arrival beer',
                    allDay    : true
                },
                {
                    id         : 4,
                    startDate  : '2022-09-11T20:00:00',
                    endDate    : '2022-09-11T21:00:00',
                    name       : 'Dinner',
                    resourceId : 'hotel'
                },
                {
                    id         : 5,
                    startDate  : '2022-09-12T09:00:00',
                    endDate    : '2022-09-12T10:00:00',
                    name       : 'Breakfast',
                    resourceId : 'hotel'
                },
                {
                    id         : 6,
                    startDate  : '2022-09-12T10:00:00',
                    endDate    : '2022-09-12T12:00:00',
                    name       : 'Team Scrum',
                    resourceId : 'apple'
                },
                {
                    id         : 7,
                    startDate  : '2022-09-12T12:00:00',
                    endDate    : '2022-09-12T14:00:00',
                    name       : 'Scheduler Grid introduction + review',
                    resourceId : 'apple'
                },
                {
                    id         : 8,
                    startDate  : '2022-09-12T14:00:00',
                    endDate    : '2022-09-12T15:00:00',
                    name       : 'Lunch',
                    resourceId : 'hotel'
                },
                {
                    id         : 9,
                    startDate  : '2022-09-12T15:00:00',
                    endDate    : '2022-09-12T19:00:00',
                    name       : 'Active client project review',
                    resourceId : 'apple'
                },
                {
                    id         : 10,
                    startDate  : '2022-09-12T19:00:00',
                    endDate    : '2022-09-12T20:00:00',
                    name       : 'Dinner',
                    resourceId : 'hotel'
                },
                {
                    id         : 11,
                    startDate  : '2022-09-13T09:00:00',
                    endDate    : '2022-09-13T10:00:00',
                    name       : 'Breakfast',
                    resourceId : 'hotel'
                },
                {
                    id         : 12,
                    startDate  : '2022-09-13T10:00:00',
                    endDate    : '2022-09-13T12:00:00',
                    name       : 'Roadmapping for 2023',
                    resourceId : 'apple'
                },
                {
                    id         : 13,
                    startDate  : '2022-09-13T12:00:00',
                    endDate    : '2022-09-13T14:00:00',
                    name       : 'Review Assembla tickets and decide features to add',
                    resourceId : 'apple'
                },
                {
                    id         : 14,
                    startDate  : '2022-09-13T14:00:00',
                    endDate    : '2022-09-13T15:00:00',
                    name       : 'Lunch',
                    resourceId : 'hotel'
                },
                {
                    id         : 15,
                    startDate  : '2022-09-13T15:00:00',
                    endDate    : '2022-09-13T19:00:00',
                    name       : 'Active programming',
                    resourceId : 'apple'
                },
                {
                    id         : 16,
                    startDate  : '2022-09-13T19:00:00',
                    endDate    : '2022-09-13T20:00:00',
                    name       : 'Dinner',
                    resourceId : 'hotel'
                },
                {
                    id         : 17,
                    startDate  : '2022-09-14T09:00:00',
                    endDate    : '2022-09-14T10:00:00',
                    name       : 'Breakfast',
                    resourceId : 'hotel'
                },
                {
                    id         : 18,
                    startDate  : '2022-09-14T10:00:00',
                    endDate    : '2022-09-14T18:00:00',
                    name       : 'Excursion',
                    resourceId : 'stephen'
                },
                {
                    id         : 19,
                    startDate  : '2022-09-14T18:00:00',
                    endDate    : '2022-09-14T22:00:00',
                    name       : 'Team Building',
                    resourceId : 'stephen',
                    eventColor : 'green'
                },
                {
                    id         : 20,
                    startDate  : '2022-09-15T09:00:00',
                    endDate    : '2022-09-15T10:00:00',
                    name       : 'Breakfast',
                    resourceId : 'hotel'
                },
                {
                    id         : 21,
                    startDate  : '2022-09-15T14:00:00',
                    endDate    : '2022-09-15T15:00:00',
                    name       : 'Lunch',
                    resourceId : 'hotel'
                },
                {
                    id         : 22,
                    startDate  : '2022-09-15T19:00:00',
                    endDate    : '2022-09-15T20:00:00',
                    name       : 'Dinner',
                    resourceId : 'hotel'
                },
                {
                    id         : 23,
                    startDate  : '2022-09-15T00:00:00',
                    endDate    : '2022-09-16T00:00:00',
                    name       : 'Gantt review + development',
                    allDay     : true,
                    resourceId : 'apple'
                },
                {
                    id         : 24,
                    startDate  : '2022-09-16T09:00:00',
                    endDate    : '2022-09-16T10:00:00',
                    name       : 'Breakfast',
                    resourceId : 'hotel'
                },
                {
                    id         : 25,
                    startDate  : '2022-09-16T14:00:00',
                    endDate    : '2022-09-16T15:00:00',
                    name       : 'Lunch',
                    resourceId : 'hotel'
                },
                {
                    id         : 26,
                    startDate  : '2022-09-16T18:00:00',
                    endDate    : '2022-09-16T21:00:00',
                    name       : 'Split.JS conference: Monitoring and Reproducing Errors in Web Applications + Late Dinner or AfterParty',
                    resourceId : 'stephen'
                },
                {
                    id         : 27,
                    startDate  : '2022-09-16T00:00:00',
                    endDate    : '2022-09-17T00:00:00',
                    name       : 'Root Cause ticket bash',
                    allDay     : true,
                    resourceId : 'apple'
                },
                {
                    id         : 28,
                    startDate  : '2022-09-17T09:00:00',
                    endDate    : '2022-09-17T10:00:00',
                    name       : 'Breakfast',
                    resourceId : 'hotel'
                },
                {
                    id         : 29,
                    startDate  : '2022-09-17T14:00:00',
                    endDate    : '2022-09-17T15:00:00',
                    name       : 'Lunch',
                    resourceId : 'hotel'
                },
                {
                    id         : 30,
                    startDate  : '2022-09-17T19:00:00',
                    endDate    : '2022-09-17T20:00:00',
                    name       : 'Dinner',
                    resourceId : 'hotel'
                },
                {
                    id         : 31,
                    startDate  : '2022-09-17T00:00:00',
                    endDate    : '2022-09-18T00:00:00',
                    name       : 'Pair programming sessions',
                    allDay     : true,
                    resourceId : 'apple'
                },
                {
                    id         : 32,
                    startDate  : '2022-09-18T09:00:00',
                    endDate    : '2022-09-18T10:00:00',
                    name       : 'Breakfast',
                    resourceId : 'hotel'
                },
                {
                    id         : 33,
                    startDate  : '2022-09-18T10:00:00',
                    endDate    : '2022-09-18T12:00:00',
                    name       : 'Check-Out & Fly home',
                    resourceId : 'stephen'
                }
            ],
            resources : [
                {
                    id         : 'hotel',
                    name       : 'Four Seasons',
                    eventColor : 'orange',
                    type       : 'Resource'
                },
                {
                    id         : 'apple',
                    name       : 'Apple team',
                    eventColor : 'blue',
                    type       : 'Employee'
                },
                {
                    id         : 'stephen',
                    name       : 'Stephen Jobs',
                    eventColor : 'deep-orange',
                    type       : 'Employee'
                }
            ]
        });
    }
});
