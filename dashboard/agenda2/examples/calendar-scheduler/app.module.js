import { DateHelper, StringHelper, DomClassList, Toast, Calendar } from '../../build/calendar.module.js?459414';
import shared from '../_shared/shared.module.js?459414';

let tickWidth = 50;

const showInfo = () => Toast.show({
    timeout : 3500,
    html    : 'Please note that this example uses the <a href="//bryntum.com/products/scheduler">Bryntum Scheduler</a>, which is licensed separately.'
});

const calendar = new Calendar({
    appendTo : 'container',

    // Start life looking at this date
    date : new Date(2020, 9, 11),

    // CrudManager arranges loading and syncing of data in JSON form from/to a web service
    crudManager : {
        autoLoad  : true,
        transport : {
            load : {
                url : 'data/data.json'
            }
        }
    },

    // These will take precedence over the Scheduler's features.
    features : {
        eventMenu : {
            items : {
                editEvent : {
                    text   : 'Edit',
                    weight : 100
                }
            }
        }
    },

    tbar : {
        items : {
            scale : {
                type    : 'slider',
                text    : 'Scale',
                min     : 25,
                max     : 100,
                value   : tickWidth,
                weight  : 650,
                width   : 100,
                onInput : ({ value }) => calendar.modes.timeline.tickSize = value
            }
        }
    },

    mode : 'timeline',

    modes : {
        day : {
            dayStartTime : 7,
            dayEndTime   : 22
        },

        week : {
            dayStartTime : 7,
            dayEndTime   : 22
        },

        timeline : {
            type : 'scheduler',

            // Used by the Calendar's mode selector button
            displayName : 'Timeline',

            // Used by resourceInfo column to base src for image field:
            resourceImagePath : '../_shared/images/users/',

            // Change default event style for Scheduler to better match Calendars look
            eventStyle : 'calendar',

            columns : [
                { type : 'resourceInfo', field : 'name', text : 'Staff/Resource', width : 175 }
            ],

            features : {
                nonWorkingTime : true
            },

            workingTime : {
                fromHour : 7,
                toHour   : 22
            },

            // Uncomment to change the date range of the time axis
            // range : 'month',

            // Uncomment to change how much the next / previous buttons shift the time axis
            // stepUnit : 'day',

            viewPreset : {
                base : 'hourAndDay',
                tickWidth,

                headers : [{
                    unit       : 'day',
                    dateFormat : 'ddd MM/DD'
                }, {
                    unit       : 'hour',
                    dateFormat : 'h'
                }]
            },

            // Custom eventRenderer to match style used by Calendar
            eventRenderer({ eventRecord, renderData }) {
                if (eventRecord.isInterDay) {
                    renderData.eventStyle = 'interday';
                    return StringHelper.encodeHtml(eventRecord.name);
                }

                renderData.style = 'align-items: start';

                const
                    { eventColor, iconCls } = renderData,
                    noIcon                  = !iconCls?.length,
                    isRecurring             = eventRecord.isRecurring || eventRecord.isOccurrence;

                return {
                    class    : 'b-cal-event-body',
                    children : [
                        {
                            class    : 'b-event-header',
                            children : [
                                {
                                    class : 'b-event-time',
                                    text  : DateHelper.format(eventRecord.startDate, 'LST')
                                },
                                isRecurring && {
                                    tag   : 'i',
                                    class : {
                                        'b-icon'                : 1,
                                        'b-fw-icon'             : 1,
                                        'b-cal-event-icon'      : !noIcon,
                                        'b-cal-recurrence-icon' : noIcon,
                                        'b-icon-recurring'      : noIcon,
                                        ...DomClassList.normalize(iconCls, 'object')
                                    },
                                    style : eventColor ? {
                                        color : eventColor
                                    } : null
                                }
                            ]
                        }, {
                            class : 'b-cal-event-desc',
                            text  : eventRecord.name
                        }
                    ]
                };
            }
        }
    }
});

setTimeout(showInfo, 3000);
