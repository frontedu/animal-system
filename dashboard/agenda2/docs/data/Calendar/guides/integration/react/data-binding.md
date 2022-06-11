# Binding Bryntum Calendar data

Bryntum Calendar is a data intensive component that uses several datasets. These datasets usually come from the server
and are held in `Calendar` project during the lifetime of the `Calendar` view. There are several ways of populating the
project data stores.

## Using CrudManager transport

[CrudManager](#Scheduler/data/CrudManager) is a built-in class that implements loading and saving of data in multiple
stores with [transport](#Scheduler/data/CrudManager#config-transport) config. Loading the stores and saving all
changes is done in one request.

Configuring `crudManager` with `transport` is the simplest way of binding data to the `Calendar` project stores as seen 
from the client side, but it does require following a specific protocol on the backend. 

The configuration of `crudManager` can be as simple as:

```javascript
crudManager : {
    transport : {
        load : {
            url : '/server/load/url'
        },
        sync : {
            url : '/server/save/url'
        }
    },
    autoLoad : true
}
```

With this configuration, the data is loaded and saved from and to the above URLs and the data `transport` is handled
automatically.

## Binding existing data to the component

When the application already has a server transport layer then the data for Calendar is available in application code and
it needs to be passed (bound) to the component. One approach is to make the data available as state variables and set
these as properties of the React component:

**App.js:**

```typescript
import React, { useState } from 'react';

import { calendarConfig } from './AppConfig';
import { projectData } from './AppData';

import './App.scss';

function App() {
    const [events, setEvents] = useState(projectData.events);
    const [assignments, setAssignments] = useState(projectData.assignments);
    const [resources, setResources] = useState(projectData.resources);

    return (
        <BryntumCalendar
            ref = {calendar}
            events = {events}
            assignments = {assignments}
            resources = {resources}
            {...calendarConfig}
        />
    );
}

export default App;
```

Here we have state variables, one per data set, together with their setters so whenever a change of data is needed the
setter needs to be called with new data as the argument and the change will be immediately reflected in the `Calendar`.

For example:

```javascript
setEvents(newEvents);
setResources(newResources);
```

## Binding existing data to the project

This approach bind data to a standalone `ProjectModel` and then uses this project in `Calendar`. Project has its own
markup in the template and it must be assigned to the `Calendar` during initialization.

This approach is suitable for more complex applications that use more than one Bryntum component that share a common
project:

**App.js:**

```typescript
import React, { useState } from 'react';

import { calendarConfig, projectConfig } from './AppConfig';
import { projectData } from './AppData';

import './App.scss';

function App() {
    const calendar = useRef();
    const project = useRef();

    const [events, setEvents] = useState(projectData.events);
    const [assignments, setAssignments] = useState(projectData.assignments);
    const [resources, setResources] = useState(projectData.resources);

    return (
        <>
            <BryntumProjectModel
                ref = {project}
                events = {events}
                assignments = {assignments}
                resources = {resources}
                {...projectConfig}
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
```

Here we create a standalone `ProjectModel` (without any rendered output) with properties bound to individual data sets.
The project must be assigned to `Calendar` in `useEffect` which is configured to run only once on component mount.

Note: `<BryntumProjectModel>` must be returned first for other components to use it. Otherwise the `Calendar` appears
blank, without any data.

Check implementation in [inline-data](../examples/frameworks/react/javascript/inline-data/) React demo.



<p class="last-modified">Last modified on 2022-05-30 6:44:29</p>