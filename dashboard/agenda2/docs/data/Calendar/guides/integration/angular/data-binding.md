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

When the application already has a server transport layer then the data for `Calendar` is available in application code
and it needs to be passed (bound) to the component. One approach is to make the data available as Angular component
class variables and then use them in templates:

**app.component.ts:**

```typescript
import { Component, OnInit } from '@angular/core';
import { calendarConfig } from './app.config';
import { DataService } from './data.service';

@Component({
    selector    : 'app-root',
    templateUrl : './app.component.html',
    styleUrls   : ['./app.component.scss'],
    providers   : [DataService]
})
export class AppComponent implements OnInit {

    events = [];
    resources = [];
    assignments = [];

    calendarConfig = calendarConfig;

    // Inject data service
    constructor(private dataService: DataService) {}

    ngOnInit(): void {
        // Get initial data
        Object.assign(this, this.dataService.getData());
    }
}
```

**app.component.html:**

```html
<bryntum-calendar
    #calendar
    ...
    [date] = "calendarConfig.date"
    [assignments] = "assignments"
    [events] = "events"
    [resources] = "resources"
></bryntum-calendar>
```

`DataService` is a placeholder name in this example and it would be replaced by the service that provides data in your
application. 

The key is to supply existing data to the class variables and then use these variables in the template.

## Binding existing data to the project

This approach bind data to a standalone `ProjectModel` and then uses this project in `Calendar`. Project has its own
markup in the template and it must be assigned to the `Calendar` during initialization.

This approach is suitable for more complex applications that use more than one Bryntum component that share a common
`project`:

**app.component.ts:**

```typescript
import { Component, OnInit } from '@angular/core';
import { calendarConfig } from './app.config';
import { DataService } from './data.service';

@Component({
    selector    : 'app-root',
    templateUrl : './app.component.html',
    styleUrls   : ['./app.component.scss'],
    providers   : [DataService]
})
export class AppComponent implements OnInit {

    events = [];
    resources = [];
    assignments = [];

    calendarConfig = calendarConfig;

    // Inject data service
    constructor(private dataService: DataService) {}

    ngOnInit(): void {
        // Get initial data
        Object.assign(this, this.dataService.getData());
    }
}
```

**app.component.html:**

```html
<bryntum-project-model
    #project
    ...
    [assignments] = "assignments"
    [events] = "events"
    [resources] = "resources"
></bryntum-project-model>

<bryntum-calendar
    #calendar
    ...
    [date] = "calendarConfig.date"
    [project] = "project"
></bryntum-calendar>
```

`DataService` is a placeholder name in this example and it would be replaced by the service that provides data in your
application.

Check implementation in [inline-data](../examples/frameworks/angular/inline-data/) Angular demo.



<p class="last-modified">Last modified on 2022-05-30 6:44:29</p>