/**
 * Application
 */
import React, { useRef, useState } from 'react';

import { BryntumCalendar, BryntumDemoHeader, BryntumThemeCombo, BryntumProjectModel } from '@bryntum/calendar-react';

import { calendarConfig } from './AppConfig';
import { projectData } from './AppData';

import './App.scss';

function App() {
    const calendar = useRef();
    const project = useRef();

    const [events] = useState(projectData.events);
    const [resources] = useState(projectData.resources);

    return (
        <>
            <BryntumDemoHeader
                href = "../../../../../#example-frameworks-react-javascript-inline-data"
                children = {<BryntumThemeCombo />}
            />
            <BryntumProjectModel
                ref = {project}
                events = {events}
                resources = {resources}
            />
            <BryntumCalendar
                ref = {calendar}
                project = {project}
                {...calendarConfig}
            />
        </>
    );
}

export default App;
