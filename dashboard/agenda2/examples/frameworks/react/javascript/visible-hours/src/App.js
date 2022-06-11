/**
 * The React App file
 */

// React libraries
import React, { Fragment } from 'react';

// Stylings
import './App.scss';

// Application components
import { BryntumDemoHeader, BryntumThemeCombo } from '@bryntum/calendar-react';
import Calendar from './components/Calendar';

const App = () => {
    const headerConfig = {
        href: '../../../../../#example-frameworks-react-javascript-visible-hours'
    };

    return (
        <Fragment>
            <BryntumDemoHeader {...headerConfig} children={<BryntumThemeCombo />} />
            <Calendar />
        </Fragment>
    );
};

export default App;
