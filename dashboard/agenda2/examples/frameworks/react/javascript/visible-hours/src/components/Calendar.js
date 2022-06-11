/**
 * Calendar Component
 */

// React libraries
import React, { useRef } from 'react';

// Bryntum libraries
import { BryntumCalendar } from '@bryntum/calendar-react';

// Application components

// Calendar component
const Calendar = props => {
    const calendarRef = useRef(null);

    // Handlers
    // This is called when the 'Scroll to hour' field changes. Sync week view's state.
    const onStartHourChange = ({ value }) => {
        calendarRef.current.instance.activeView.scrollTo(value, {
            animate: true,
            block: 'start'
        });
    };

    // Calendar config
    const calendarConfig = {
        // Start life looking at this date
        date: new Date(2020, 9, 12),

        // CrudManager arranges loading and syncing of data in JSON form from/to a web service
        crudManager: {
            transport: {
                load: {
                    url: 'data/data.json'
                }
            },
            autoLoad: true
        },

        // Modes are the views available in the Calendar.
        // An object may be used to configure the view.
        // null means do not include the view.
        modes: {
            agenda: null,
            month: null,
            year: null,
            day: {
                hourHeight: 70,
                // These two settings decide what time span is rendered
                dayStartTime: 4,
                dayEndTime: 22,

                // Scroll to 7am initially
                visibleStartTime: 7
            },
            week: {
                hourHeight: 70,
                // These two settings decide what time span is rendered
                dayStartTime: 4,
                dayEndTime: 22,

                // Scroll to 7am initially
                visibleStartTime: 7
            }
        },

        // The Calendar's top toolbar.
        // We can alter its items configuration.
        // In this case, we add a new UI item.
        tbar: {
            items: {
                scrollHour: {
                    cls: 'hourField',
                    label: 'Scroll to hour',
                    type: 'numberfield',
                    value: 7,
                    weight: 650,
                    min: 4,
                    max: 21,
                    onChange: onStartHourChange
                }
            }
        }
    };

    return <BryntumCalendar {...calendarConfig} {...props} ref={calendarRef} />;
};

export default Calendar;
