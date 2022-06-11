/**
 * Application config file
 */
import { EventModel, CalendarConfig, GridConfig, StringHelper } from '@bryntum/calendar/calendar.lite.umd.js';
import { unplannedData } from './app.data';

export const calendarConfig : Partial<CalendarConfig> = {
    // Features named by the properties are included.
    // An object is used to configure the feature.
    features : {
        eventTooltip : {
            align : 'l-r'
        },
        externalEventSource : {
            grid : 'unscheduled'
        }
    },

    date : new Date(2020, 9, 11),

    // Modes are the views available in the Calendar.
    // An object is used to configure the view.
    modes : {
        agenda : null
    }
};

export const gridConfig : Partial<GridConfig> = {
    id          : 'unscheduled',
    title       : 'Unscheduled Events',
    collapsible : true,
    flex        : '0 0 300px',
    ui          : 'calendar-banner',
    store       : {
        modelClass : EventModel,
        data       : unplannedData
    },
    features : {
        stripe   : true,
        sort     : 'name',
        cellEdit : false,
        group    : false
    },
    columns : [
        {
            text       : 'Unassigned tasks',
            flex       : 1,
            field      : 'name',
            htmlEncode : false,
            renderer   : ({ record } : { record:EventModel }) =>
                // @ts-ignore
                StringHelper.xss`<i class="${record.iconCls}"></i>${record.name}`
        },
        {
            text     : 'Duration',
            width    : 100,
            align    : 'right',
            editor   : false,
            field    : 'duration',
            renderer : ({ record } : { record:EventModel }) =>
                `${record.duration} ${record.durationUnit}`
        }
    ],

    rowHeight : 50
};
