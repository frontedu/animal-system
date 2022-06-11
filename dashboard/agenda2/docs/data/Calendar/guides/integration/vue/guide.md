<h1 class="title-with-image"><img src="Core/logo/vue.svg"
alt="Bryntum Calendar supports Vue"/>Using Bryntum Calendar with Vue</h1>

## Bryntum NPM repository access

Please refer to this [guide for Bryntum NPM repository access](#Calendar/guides/npm-repository.md).

## Bryntum Calendar

Bryntum Calendar itself is framework agnostic, but it ships with demos and wrappers to simplify using it with popular
frameworks such as Vue. The purpose of this guide is to give a basic introduction on how to use Bryntum Calendar with Vue.

## View online demos

Bryntum Calendar Vue demos can be viewed in our
[online example browser](https://bryntum.com/examples/calendar/#Integration/Vue).

## Build and run local demos

Vue demos are located in **examples/frameworks/vue** and **examples/frameworks/vue-3** folders inside distribution zip.

Trial distribution zip can be requested from [https://bryntum.com](https://bryntum.com/products/calendar)
by clicking **Free Trial** button. Licensed distribution zip is located at
[Bryntum Customer Zone](https://customerzone.bryntum.com).

Each demo contains bundled `README.md` file in demo folder with build and run instructions.

To view and run an example locally in development mode, you can use the following commands:

```shell
$ npm install
$ npm run start
```

That starts a local server accessible at [http://127.0.0.1:8080](http://127.0.0.1:8080). If you modify the example code
while running it locally it is automatically rebuilt and updated in the browser allowing you to see your changes
immediately.

The production version of an example, or your application, is built by running:

```shell
$ npm install
$ npm run build
```

## TypeScript and Typings

Bryntum bundles ship with typings for the classes for usage in TypeScript applications. You can find `calendar*.d.ts`
files in the `build` folder inside the distribution zip package. The definitions also contain a special config type
which can be passed to the class constructor.

The config specific types are also accepted by multiple other properties and functions, for example
the [Store.data](#Core/data/Store#config-data) config of the `Store` which accepts type `Partial<ModelConfig>[]`.

Sample code for tree store creation with `ModelConfig` and `StoreConfig` classes:

```typescript
import { Store, StoreConfig, ModelConfig } from '@bryntum/calendar';

const storeConfig: Partial<StoreConfig> = {
    tree : true,
    data : [
        {
            id       : 1,
            children : [
                {
                    id : 2
                }
            ] as Partial<ModelConfig>[]
        }
    ] as Partial<ModelConfig>[]
};

new Store(storeConfig);
```

## Wrappers

The Vue wrappers encapsulate Bryntum Calendar and other Bryntum widgets in Vue components that expose
configuration options, properties, features and events. The wrapped all Bryntum UI components so they can be used the
usual Vue way.

To use native API package classes with wrappers import them from `@bryntum/calendar`.

```javascript
import { Calendar } from '@bryntum/calendar';
```

### Installing the wrappers package

The wrappers are distributed as a separate package `@bryntum/calendar-vue` that is installed according to the used
package manager. Please refer to this [guide for Bryntum NPM repository access](#Calendar/guides/npm-repository.md).

### Wrappers Overview

Wrappers are Vue components which provide full access to Bryntum API widget class configs, properties, events and
features. Each Wrapper has it's own HTML tag which can be used in vue templates. This is the list of available
wrappers for Bryntum Calendar Vue package:

| Wrapper tag name | API widget reference |
|------------------|----------------------|
| &lt;bryntum-button/&gt; | [Button](#Core/widget/Button) |
| &lt;bryntum-button-group/&gt; | [ButtonGroup](#Core/widget/ButtonGroup) |
| &lt;bryntum-calendar/&gt; | [Calendar](#Calendar/view/Calendar) |
| &lt;bryntum-checkbox/&gt; | [Checkbox](#Core/widget/Checkbox) |
| &lt;bryntum-chip-view/&gt; | [ChipView](#Core/widget/ChipView) |
| &lt;bryntum-combo/&gt; | [Combo](#Core/widget/Combo) |
| &lt;bryntum-container/&gt; | [Container](#Core/widget/Container) |
| &lt;bryntum-date-field/&gt; | [DateField](#Core/widget/DateField) |
| &lt;bryntum-date-picker/&gt; | [DatePicker](#Core/widget/DatePicker) |
| &lt;bryntum-date-time-field/&gt; | [DateTimeField](#Core/widget/DateTimeField) |
| &lt;bryntum-display-field/&gt; | [DisplayField](#Core/widget/DisplayField) |
| &lt;bryntum-duration-field/&gt; | [DurationField](#Core/widget/DurationField) |
| &lt;bryntum-file-field/&gt; | [FileField](#Core/widget/FileField) |
| &lt;bryntum-file-picker/&gt; | [FilePicker](#Core/widget/FilePicker) |
| &lt;bryntum-filter-field/&gt; | [FilterField](#Core/widget/FilterField) |
| &lt;bryntum-grid/&gt; | [Grid](#Grid/view/Grid) |
| &lt;bryntum-grid-base/&gt; | [GridBase](#Grid/view/GridBase) |
| &lt;bryntum-list/&gt; | [List](#Core/widget/List) |
| &lt;bryntum-menu/&gt; | [Menu](#Core/widget/Menu) |
| &lt;bryntum-number-field/&gt; | [NumberField](#Core/widget/NumberField) |
| &lt;bryntum-paging-toolbar/&gt; | [PagingToolbar](#Core/widget/PagingToolbar) |
| &lt;bryntum-panel/&gt; | [Panel](#Core/widget/Panel) |
| &lt;bryntum-password-field/&gt; | [PasswordField](#Core/widget/PasswordField) |
| &lt;bryntum-project-combo/&gt; | [ProjectCombo](#Scheduler/widget/ProjectCombo) |
| &lt;bryntum-radio/&gt; | [Radio](#Core/widget/Radio) |
| &lt;bryntum-radio-group/&gt; | [RadioGroup](#Core/widget/RadioGroup) |
| &lt;bryntum-resource-combo/&gt; | [ResourceCombo](#Scheduler/widget/ResourceCombo) |
| &lt;bryntum-resource-filter/&gt; | [ResourceFilter](#Scheduler/widget/ResourceFilter) |
| &lt;bryntum-resource-view/&gt; | [ResourceView](#Calendar/widget/ResourceView) |
| &lt;bryntum-scheduler-date-picker/&gt; | [SchedulerDatePicker](#Scheduler/widget/SchedulerDatePicker) |
| &lt;bryntum-sidebar/&gt; | [Sidebar](#Calendar/widget/Sidebar) |
| &lt;bryntum-slider/&gt; | [Slider](#Core/widget/Slider) |
| &lt;bryntum-slide-toggle/&gt; | [SlideToggle](#Core/widget/SlideToggle) |
| &lt;bryntum-splitter/&gt; | [Splitter](#Core/widget/Splitter) |
| &lt;bryntum-tab-panel/&gt; | [TabPanel](#Core/widget/TabPanel) |
| &lt;bryntum-text-area-field/&gt; | [TextAreaField](#Core/widget/TextAreaField) |
| &lt;bryntum-text-area-picker-field/&gt; | [TextAreaPickerField](#Core/widget/TextAreaPickerField) |
| &lt;bryntum-text-field/&gt; | [TextField](#Core/widget/TextField) |
| &lt;bryntum-time-field/&gt; | [TimeField](#Core/widget/TimeField) |
| &lt;bryntum-time-picker/&gt; | [TimePicker](#Core/widget/TimePicker) |
| &lt;bryntum-toolbar/&gt; | [Toolbar](#Core/widget/Toolbar) |
| &lt;bryntum-trial-button/&gt; | [TrialButton](#Core/widget/trial/TrialButton) |
| &lt;bryntum-undo-redo/&gt; | [UndoRedo](#Scheduler/widget/UndoRedo) |
| &lt;bryntum-widget/&gt; | [Widget](#Core/widget/Widget) |

### Using the wrapper in your application

Now you can use the the component defined in the wrapper in your application:

Sample code for `App.vue`:

```html
<template>
    <bryntum-calendar
        ref="calendar"
        tooltip="calendarConfig.tooltip"
        v-bind="calendarConfig"
        @click="onClick"
    />
</template>

<script>

import { BryntumCalendar } from '@bryntum/calendar-vue';
import { calendarConfig } from './AppConfig';
import './components/ColorColumn.js';

export default {
    name: 'app',

    // local components
    components: {
        BryntumCalendar
    },
    data() {
        return { calendarConfig };
    }
};
</script>

<style lang="scss">
@import './App.scss';
</style>
```

As shown above you can assign values and bind to Vue data with `tooltip="calendarConfig.tooltip"` or `v-bind` option.
Listen to events with `@click="onClick"`, or use `v-on`.

`AppConfig.js` should contain a simple Bryntum Calendar configuration.
We recommend to keep it in a separate file because it can become lengthy especially for more advanced configurations.

Sample code for `AppConfig.js`:

```javascript
export const calendarConfig =  {
    tooltip : "My cool Bryntum Calendar component"
    // Bryntum Calendar config options
};
```

Add `sass-loader` to your `package.json` if you used SCSS.

You will also need to import CSS file for Bryntum Calendar.
The ideal place for doing it is the beginning of `App.scss/App.css` that would be imported in `App.vue`:

```javascript
@import "~@bryntum/calendar/calendar.stockholm.css";
```

### Embedding widgets inside wrapper

Wrappers are designed to allow using Bryntum widgets as Vue components, but they themselves cannot contain other
Bryntum wrappers inside their tag. To embed Bryntum widgets inside a wrapper you should instead use the available
configuration options for the wrapper's widget. Please note that not all widgets may contain inner widgets, please refer
to the API docs to check for valid configuration options.

This example shows how to use a `Toolbar` widget inside the wrapper for Bryntum Calendar:

Sample code for `AppConfig.js`:

```javascript
export const calendarConfig =  {
    // Toolbar (tbar) config
    tbar: {
        items : [
            {
                type : 'button',
                text : 'My button'
            }
        ]
    }
    // Bryntum Calendar config options
};
```

### Syncing bound data changes

The stores used by the wrapper enable [syncDataOnLoad](#Core/data/Store#config-syncDataOnLoad) by default (Stores not
used by the wrapper have it disabled by default). It is done to make Vue column renderer update the value.
Without `syncDataOnLoad`, each time a new array of data is set to the store would apply the data as a completely new
dataset. With `syncDataOnLoad`, the new state is instead compared to the old, and the differences are applied.

## Configs, properties and events

All Bryntum Vue Wrappers support the full set of the public configs, properties and events of a component.

### Using dataChange event to synchronize data

Bryntum Calendar keeps all data in its stores which are automatically synchronized with the UI and the user actions.
Nevertheless, it is sometimes necessary for the rest of the application to be informed about data changes. For that
it is easiest to use `dataChange` event.

```javascript
<template>
        <bryntum-calendar
            ref="calendar"
            v-bind="calendarConfig"
            @datachange="syncData"
        />
    </div>
</template>

<script>
import { BryntumCalendar } from "@bryntum/calendar-vue";
import { calendarConfig } from "./AppConfig.js";

export default {
    name: "App",

    components: { BryntumCalendar },

    methods: {
        syncData({ store, action, records }) {
            console.log(`${store.id} changed. The action was: ${action}. Changed records: `, records);
            // Your sync data logic comes here
        }
    },

    data() {
        return { calendarConfig };
    }
};
</script>
```

### Wrapper configs

* `relayStoreEvents` - set it to `true` to relay events from stores to `Calendar` instance.
`dataChange` event fires twice if set to true.  Defaults to `false`.

## Features

Features are suffixed with `Feature` and act as both configs and properties for `BryntumCalendarComponent`.
They are mapped to the corresponding API features of the Bryntum Calendar `instance`.

This is a list of all `BryntumCalendarComponent` features:

|Wrapper feature name|API feature reference |
|--------------------|----------------------|
| dragFeature | [CalendarDrag](#Calendar/feature/CalendarDrag) |
| eventEditFeature | [EventEdit](#Calendar/feature/EventEdit) |
| eventMenuFeature | [EventMenu](#Calendar/feature/EventMenu) |
| eventTooltipFeature | [EventTooltip](#Calendar/feature/EventTooltip) |
| externalEventSourceFeature | [ExternalEventSource](#Calendar/feature/ExternalEventSource) |
| loadOnDemandFeature | [LoadOnDemand](#Calendar/feature/LoadOnDemand) |
| printFeature | [Print](#Calendar/feature/print/Print) |
| scheduleMenuFeature | [ScheduleMenu](#Calendar/feature/ScheduleMenu) |
| weekExpanderFeature | [WeekExpander](#Calendar/feature/WeekExpander) |

## Bryntum Calendar API instance

It is important to know that the Vue `BryntumCalendarComponent` is **not** the native Bryntum Calendar instance, it
is a wrapper or an interface between the Vue application and the Bryntum Calendar itself.

All available configs, properties and features are propagated from the wrapper down to the underlying Bryntum Calendar
instance, but there might be the situations when you want to access the Bryntum Calendar directly. That is fully valid
approach and you are free to do it.

### Accessing the Bryntum Calendar instance (Vue 2)

If you need to access Bryntum Calendar functionality not exposed by the wrapper, you can access the Bryntum Calendar instance
directly. Within the **Vue 2** wrapper it is available under the `instance` property.

This simple example shows how you could use it:

App.vue
```html
<template>
    <bryntum-calendar ref="calendar" v-bind="calendarConfig" />
</template>

<script>
// Bryntum Calendar and its config
import { BryntumCalendar } from '@bryntum/calendar-vue';
import { calendarConfig } from './CalendarConfig';
import './components/ColorColumn.js';

// App
export default {
    name: 'App',

    // local components
    components: {
        BryntumCalendar
    },

    data() {
        return { calendarConfig };
    },

    methods: {
        doSomething() {
            // Reference to Bryntum Calendar instance
            const calendarInstance = this.$refs.calendar.instance;
        }
    }
};
</script>

<style lang="scss">
@import './App.scss';
</style>
```

When accessing `instance` directly, use wrapper's API widget reference docs from the list above to get available
configs and properties.

### Accessing the Bryntum Calendar instance (Vue 3)

If you need to access Bryntum Calendar functionality not exposed by the wrapper, you can access the Bryntum Calendar instance
directly. Within the **Vue 3** wrapper it is available under the `instance.value` property.

This simple example shows how you could use it:

App.vue
```html
<template>
    <bryntum-calendar ref="calendar" v-bind="calendarConfig" />
</template>

<script>
// vue imports
import { ref, reactive } from 'vue';

// Bryntum Calendar and its config
import { BryntumCalendar } from '@bryntum/calendar-vue-3';
import { useCalendarConfig } from './CalendarConfig';
import './components/ColorColumn.js';

// App
export default {
    name: 'App',

    // local components
    components: {
        BryntumCalendar
    },

    setup() {
        const calendar = ref(null);
        const calendarConfig = reactive(useCalendarConfig());

        doSomething() {
            // Reference to Bryntum Calendar instance
            const calendarInstance = calendar.value.instance.value;
        }

        return {
            calendar,
            calendarConfig,
            doSomething
        };
    },
};
</script>

<style lang="scss">
@import './App.scss';
</style>
```

When accessing `instance` directly, use wrapper's API widget reference docs from the list above to get available
configs and properties.

## Troubleshooting

### Installing, building or running

If you face any issues building or running examples or your application, such issues can be often resolved by the
Project Cleanup procedure which is described in this
[Troubleshooting guide](#Calendar/guides/npm-repository.md#troubleshooting)

### Transpiling dependencies
If you use Vue CLI, you can also try adding the following to your `vue.config.js`:

```javascript
module.exports = {
...
    transpileDependencies: [
        '@bryntum/calendar'
    ],
};
```

### Custom Configurations

[Vue CLI](https://cli.vuejs.org/) is the default tooling for creating, developing and managing Vue applications so it
has been chosen for our examples. It also provides an abstraction level between the application and Webpack and easy
configurability of the project through `vue.config.js` file.

While this approach would be best in majority of cases, you can still have a custom Webpack configuration that is not
managed by Vue CLI. Although it is not feasible for us to support all possible custom configurations we have some
guidelines to make the Bryntum Calendar integration easier and smoother.

If you face any issues, executing one or more of the following steps should resolve the problem.

### Add or edit `.eslintignore` file

It may also be necessary to ignore linter for some files. If you do not have `.eslintignore` in your project root create
it (edit it otherwise) so that it has at least the following content:

```javascript
calendar.module.js
```

## JavaScript heap out of memory

"JavaScript heap out of memory" error occurs on large projects where the default amount of memory allocated by node is
not sufficient to complete the command successfully.

You can increase this amount by running the following command:

**For Linux/macOS:**

```shell
export NODE_OPTIONS=--max-old-space-size=8192
```

**For Windows powershell:**

```shell
$env:NODE_OPTIONS="--max-old-space-size=8192"
```

Alternatively you can increase the amount of memory by adding the following
`NODE_OPTIONS='--max-old-space-size=8192'` config to `scripts` section in **package.json** file:

**For example change used build script:**

```json
{
  "scripts": {
    "build": "your-build-script"
  }
}
```

**to:**

```json
{
  "scripts": {
    "build": "cross-env NODE_OPTIONS='--max-old-space-size=8192' your-build-script"
  }
}
```

To apply this environment config you need `cross-env` npm library which can be installed to devDependencies with:

```shell
nmp install cross-env --save-dev
```

## References

* Config options, features, events and methods [Bryntum Calendar API docs](#api)
* Visit [Vue Framework Homepage](https://vuejs.org)
* Post your questions to [Bryntum Support Forum](https://bryntum.com/forum/)
* [Contacts us](https://bryntum.com/contact/)


<p class="last-modified">Last modified on 2022-05-30 6:44:29</p>