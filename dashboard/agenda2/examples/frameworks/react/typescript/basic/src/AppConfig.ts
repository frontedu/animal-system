/**
 * Application configuration
 */
import { BryntumCalendarProps } from '@bryntum/calendar-react';

const calendarConfig: BryntumCalendarProps = {
    date : new Date(2022, 2, 15),

    // CrudManager arranges loading and syncing of data in JSON form from/to a web service
    crudManager : {
        // autoLoad: true,
        transport : {
            load : {
                url : 'data/data.json'
            }
        }
    }
};

export { calendarConfig };
