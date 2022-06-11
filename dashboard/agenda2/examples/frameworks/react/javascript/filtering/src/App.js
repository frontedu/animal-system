/**
 * Application
 */
import React, { Fragment, useRef } from 'react';

import {
    BryntumCalendar,
    BryntumDemoHeader,
    BryntumThemeCombo,
    BryntumTextField
} from '@bryntum/calendar-react';
import { calendarConfig, filterConfig, highlightConfig } from './AppConfig';
import './App.scss';

const App = () => {
    const calendarRef = useRef(null);

    const filterChangeHandler = ({ value }) => {
        // We filter using a RegExp, so quote significant characters
        value = value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

        // A filter with an id replaces any previous filter with that id.
        // Leave any other filters which may be in use in place.
        calendarRef.current.instance.eventStore.filter({
            id: 'eventNameFilter',
            filterBy: event => event.name.match(new RegExp(value, 'i'))
        });
    };
    const highlightChangeHandler = ({ value }) => {
        value = value.toLowerCase();
        const { instance } = calendarRef.current;
        const { eventStore } = instance;

        // Calendars refresh on any data change so suspend that.
        // We will trigger the store's change event when we're done.
        eventStore.suspendEvents();

        // Loop through all events in the store
        eventStore.forEach(task => {
            // The cls field is a DomClassList with add and remove methods
            if (value !== '' && task.name.toLowerCase().includes(value)) {
                task.cls.add('b-match');
            } else {
                task.cls.remove('b-match');
            }
        });

        eventStore.resumeEvents();

        // Announce that data has changed which will refresh UIs.
        eventStore.trigger('change');

        instance.element.classList[value.length > 0 ? 'add' : 'remove']('b-highlighting');
    };

    return (
        <Fragment>
            <BryntumDemoHeader
                href="../../../../../#example-frameworks-react-javascript-filtering"
                children={<BryntumThemeCombo />}
            />
            <div className="demo-toolbar align-right">
                <BryntumTextField onChange={filterChangeHandler} {...filterConfig} />
                <BryntumTextField onChange={highlightChangeHandler} {...highlightConfig} />
            </div>
            <BryntumCalendar ref={calendarRef} {...calendarConfig}></BryntumCalendar>
        </Fragment>
    );
};

export default App;
