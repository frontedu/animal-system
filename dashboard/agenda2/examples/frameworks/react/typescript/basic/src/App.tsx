/**
 * Application
 */
import React, { Fragment, FunctionComponent, useRef, useEffect } from 'react';
import { BryntumDemoHeader, BryntumThemeCombo, BryntumCalendar } from '@bryntum/calendar-react';
import { Calendar } from '@bryntum/calendar';
import { calendarConfig } from './AppConfig';
import './App.scss';

const App: FunctionComponent = () => {
    const calendarRef = useRef<BryntumCalendar>(null);
    const calendarInstance = () => calendarRef.current?.instance as Calendar;

    useEffect(() => {
        // This shows loading data
        // To load data automatically configure crudManager with `autoLoad : true`
        calendarInstance().crudManager.load();
    });

    return (
        <Fragment>
            <BryntumDemoHeader
                href = "../../../../../#example-frameworks-react-typescript-basic"
                children = {<BryntumThemeCombo />}
            />
            <BryntumCalendar
                ref = {calendarRef}
                {...calendarConfig}
            />
        </Fragment>
    );
};

export default App;
