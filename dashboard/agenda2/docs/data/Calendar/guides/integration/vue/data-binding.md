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

When the application already has a server transport layer then the data for `Calendar` is available in application
code and it needs to be passed (bound) to the component. One approach is to make the data available as component
variables and bind them in the Vue template:

**App.vue:**

```javascript
<template>
    <bryntum-calendar
        :assignments = "assignments"
        :events = "events"
        :resources = "resources"
        v-bind = "calendarConfig"
    />
</template>

<script>
import { ref, reactive } from 'vue';

import { BryntumCalendar } from '@bryntum/calendar-vue-3';

import { useCalendarConfig } from '@/AppConfig';
import * as appData from '@/AppData';

export default {
    name : 'App',

    components : {
        BryntumCalendar
    },

    setup() {
        const calendarConfig = reactive(useCalendarConfig());

        const assignments = ref(appData.assignments);
        const events = ref(appData.events);
        const resources = ref(appData.resources);

        return {
            calendarConfig,
            assignments,
            events,
            resources
        };
    }
};
</script>

<style lang = "scss">
@import './App.scss';
</style>
```

Here we have component variables, initialized by spreading `...initialData`. Whenever a change of the data is needed,
it is only necessary to assign the new values to these variables, for example:

```javascript
this.events = newEvents;
this.dependencies = newDependencies;
```



<p class="last-modified">Last modified on 2022-05-30 6:44:29</p>