<h1 class="title-with-image"><img src="Core/logo/react.svg"
alt="Bryntum Calendar supports React"/>Using Bryntum Calendar with React</h1>

## Bryntum NPM repository access

Please refer to this [guide for Bryntum NPM repository access](#Calendar/guides/npm-repository.md).

## Bryntum Calendar

Bryntum Calendar itself is framework agnostic, but ships with demos and wrappers to simplify using it with popular frameworks
such as React. The purpose of this guide is to give a basic introduction on how to use Bryntum Calendar with React.

Bryntum Calendar is integrated to React applications using the provided wrappers.

### The React wrappers

The wrappers encapsulate Bryntum Calendar and other Bryntum widgets in React components that expose configuration
options, properties, features and events. The wrapped Bryntum components are then used the usual React way.

## View online demos

Bryntum Calendar demos can be viewed in our
[online example browser](https://bryntum.com/examples/calendar/#Integration/React).

## Build and run local demos

React demos are located in **examples/frameworks/react** folder inside distribution zip.

Trial distribution zip can be requested from [https://bryntum.com](https://bryntum.com/products/calendar)
by clicking **Free Trial** button. Licensed distribution zip is located at
[Bryntum Customer Zone](https://customerzone.bryntum.com).

Each demo contains bundled `README.md` file in demo folder with build and run instructions.

You may run them either in development mode or built for production. They have been created using
[create-react-app](https://github.com/facebook/create-react-app) script so that they can be run locally by running:

```shell
$ npm install
$ npm run start
```

That starts a local server accessible at [http://localhost:3000](http://localhost:3000). If
you modify the example code while running it locally it is automatically rebuilt and updated in the browser allowing you
to see your changes immediately.

The production version of an example, or your application, is built by running:

```shell
$ npm install
$ npm run build
```

The built version is then located in `build` sub-folder which contains the compiled code that can be deployed to your
production server.

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

### Installing the wrappers package

The wrappers are implemented in a separate package `@bryntum/calendar-react` that is installed according to the used
package manager. Please refer to this [guide for Bryntum NPM repository access](#Calendar/guides/npm-repository.md).

To use native API package classes with wrappers import them from `@bryntum/calendar`.

```javascript
import { Calendar } from '@bryntum/calendar';
```

### Wrappers Overview

Wrappers are React components which provide full access to Bryntum API widget class configs, properties, events and
features. Each Wrapper has it's own tag which can be used in React JSX code. This is the list of available wrappers for
Bryntum Calendar React package.

| Wrapper name | API widget reference |
|--------------|----------------------|
| &lt;BryntumButton/&gt; | [Button](#Core/widget/Button) |
| &lt;BryntumButtonGroup/&gt; | [ButtonGroup](#Core/widget/ButtonGroup) |
| &lt;BryntumCalendar/&gt; | [Calendar](#Calendar/view/Calendar) |
| &lt;BryntumCheckbox/&gt; | [Checkbox](#Core/widget/Checkbox) |
| &lt;BryntumChipView/&gt; | [ChipView](#Core/widget/ChipView) |
| &lt;BryntumCombo/&gt; | [Combo](#Core/widget/Combo) |
| &lt;BryntumContainer/&gt; | [Container](#Core/widget/Container) |
| &lt;BryntumDateField/&gt; | [DateField](#Core/widget/DateField) |
| &lt;BryntumDatePicker/&gt; | [DatePicker](#Core/widget/DatePicker) |
| &lt;BryntumDateTimeField/&gt; | [DateTimeField](#Core/widget/DateTimeField) |
| &lt;BryntumDisplayField/&gt; | [DisplayField](#Core/widget/DisplayField) |
| &lt;BryntumDurationField/&gt; | [DurationField](#Core/widget/DurationField) |
| &lt;BryntumFileField/&gt; | [FileField](#Core/widget/FileField) |
| &lt;BryntumFilePicker/&gt; | [FilePicker](#Core/widget/FilePicker) |
| &lt;BryntumFilterField/&gt; | [FilterField](#Core/widget/FilterField) |
| &lt;BryntumGrid/&gt; | [Grid](#Grid/view/Grid) |
| &lt;BryntumGridBase/&gt; | [GridBase](#Grid/view/GridBase) |
| &lt;BryntumList/&gt; | [List](#Core/widget/List) |
| &lt;BryntumMenu/&gt; | [Menu](#Core/widget/Menu) |
| &lt;BryntumNumberField/&gt; | [NumberField](#Core/widget/NumberField) |
| &lt;BryntumPagingToolbar/&gt; | [PagingToolbar](#Core/widget/PagingToolbar) |
| &lt;BryntumPanel/&gt; | [Panel](#Core/widget/Panel) |
| &lt;BryntumPasswordField/&gt; | [PasswordField](#Core/widget/PasswordField) |
| &lt;BryntumProjectCombo/&gt; | [ProjectCombo](#Scheduler/widget/ProjectCombo) |
| &lt;BryntumRadio/&gt; | [Radio](#Core/widget/Radio) |
| &lt;BryntumRadioGroup/&gt; | [RadioGroup](#Core/widget/RadioGroup) |
| &lt;BryntumResourceCombo/&gt; | [ResourceCombo](#Scheduler/widget/ResourceCombo) |
| &lt;BryntumResourceFilter/&gt; | [ResourceFilter](#Scheduler/widget/ResourceFilter) |
| &lt;BryntumResourceView/&gt; | [ResourceView](#Calendar/widget/ResourceView) |
| &lt;BryntumSchedulerDatePicker/&gt; | [SchedulerDatePicker](#Scheduler/widget/SchedulerDatePicker) |
| &lt;BryntumSidebar/&gt; | [Sidebar](#Calendar/widget/Sidebar) |
| &lt;BryntumSlider/&gt; | [Slider](#Core/widget/Slider) |
| &lt;BryntumSlideToggle/&gt; | [SlideToggle](#Core/widget/SlideToggle) |
| &lt;BryntumSplitter/&gt; | [Splitter](#Core/widget/Splitter) |
| &lt;BryntumTabPanel/&gt; | [TabPanel](#Core/widget/TabPanel) |
| &lt;BryntumTextAreaField/&gt; | [TextAreaField](#Core/widget/TextAreaField) |
| &lt;BryntumTextAreaPickerField/&gt; | [TextAreaPickerField](#Core/widget/TextAreaPickerField) |
| &lt;BryntumTextField/&gt; | [TextField](#Core/widget/TextField) |
| &lt;BryntumTimeField/&gt; | [TimeField](#Core/widget/TimeField) |
| &lt;BryntumTimePicker/&gt; | [TimePicker](#Core/widget/TimePicker) |
| &lt;BryntumToolbar/&gt; | [Toolbar](#Core/widget/Toolbar) |
| &lt;BryntumTrialButton/&gt; | [TrialButton](#Core/widget/trial/TrialButton) |
| &lt;BryntumUndoRedo/&gt; | [UndoRedo](#Scheduler/widget/UndoRedo) |
| &lt;BryntumWidget/&gt; | [Widget](#Core/widget/Widget) |

### Using the wrapper in your application

The wrapper defines a React component named `BryntumCalendar`. You can use it the same way as you would use other React
components. For example:

Sample code for `App.js`:

```javascript
import React from 'react';
import { BryntumCalendar } from '@bryntum/calendar-react';
import { calendarConfig } from './AppConfig'

export const App = () => {
    return (
        <BryntumCalendar
            {...calendarConfig}
            // other props, event handlers, etc
        />
    );
}
```

Sample code for `AppConfig.js`:

```javascript
export const calendarConfig =  {
    tooltip : "My cool Bryntum Calendar component",
    // Bryntum Calendar config options
};
```

### Using the wrapper in TypeScript application

Bryntum React wrappers for Bryntum Calendar are bundled with TypeScript definitions which makes it possible to use them in 
TypeScript React applications.

Each wrapper has properties definitions stored in a class with the wrapper's name and suffixed with `Props`.

This code shows how to use typed wrapper configuration for `BryntumCalendar`:

**AppConfig.ts:**

```typescript
import { BryntumCalendarProps } from '@bryntum/calendar-react';

const calendarConfig: BryntumCalendarProps = {
    // Wrapper configuration
    ...
};
```

**App.tsx:**

```typescript
import React, { Fragment, FunctionComponent, useRef } from 'react';
import { BryntumCalendar } from '@bryntum/calendar-react';
import { Calendar } from '@bryntum/calendar';
import { calendarConfig } from './AppConfig';

const App: FunctionComponent = () => {
    const calendarRef = useRef<BryntumCalendar>(null);
    const calendarInstance = () => calendarRef.current?.instance as Calendar;

    return (
        <Fragment>
            <BryntumCalendar
                ref = {calendarRef}
                {...calendarConfig}
            />
        </Fragment>
    );
};

export default App
```

### Embedding widgets inside wrapper

Wrappers are designed to allow using Bryntum widgets as React components, but they themselves cannot contain other
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
used by the wrapper have it disabled by default). This allows two-way binding to work out of the box.
Without `syncDataOnLoad`, each change to state would apply the bound data as a completely new dataset.
With `syncDataOnLoad`, the new state is instead compared to the old, and the differences are applied.

## Rendering React components in column cells

Bryntum Calendar column already supports a [renderer](#Grid/column/Column#config-renderer) configuration option which is
a function that receives parameters used as inputs to compose the resulting html. Any kind of conditional complex logic
can be used to prepare visually rich cell contents.

If you have a React component that implements the desired cell visualization, it is possible to use it by using regular
JSX which references your React components from the cell renderer. The support is implemented in the `BryntumCalendar`
wrapper therefore the wrapper must be used for the JSX renderers to work.

### Using simple inline JSX

Using inline JSX is as simple as the following:

```javascript
renderer: ({ value }) => <CustomComponent>{value}</CustomComponent>
```

If you also need to access other data fields or pass them into the React component, you can do it this way:

```javascript
renderer: (renderData) => {
  return(
    <CustomComponent dataProperty={renderData} ><b>{renderData.value}</b>/{renderData.record.city}</CustomComponent>
  );
}
```

<div class="note">
Mind please that the above functions return html-like markup without quotes. That makes the return value JSX and it is
understood and processed as such. If you enclose the markup in quotes it will not work
</div>

### Using a custom React component

It is similarly simple. Let's have the following simple component:

```javascript
import React from 'react';

const DemoButton = props => {
    return <button {...props}>{props.text}</button>;
};

```

The renderer then could be:

```javascript
import DemoButton from '../components/DemoButton';

handleCellButtonClick = (record) => {
    alert('Go ' + record.team + '!');
};

return (
  <BryntumCalendar
    // Columns
    columns = {[
      {
        // Using custom React component
        renderer : ({ record }) =>
          <DemoButton
            text = {'Go ' + record.team + '!'}
            onClick = {() => handleCellButtonClick(record)}
          />,
        // other column props,
      },
      // ... other columns
    ]}
    // ... other BryntumCalendar props
  />
);
```

The column `renderer` function above is expected to return JSX, exactly same as in the case of simple inline JSX, but
here it returns imported `DemoButton` component. The `renderer` also passes the mandatory props down to the component so
that it can render itself in the correct row context.

## Configs, properties and events

All Bryntum React Wrappers support the full set of the public configs, properties and events of a component.

### Listening to BryntumCalendar events

The conventional React way is used to listen to Bryntum Calendar events. For example, if we want to listen
to `selectionChange` event we pass the listener function to `onSelectionChange` property. The property name must be
camel case and is case sensitive.

```javascript
const selectionChangeHandler = useCallback(({ selection }) => {
    console.log(selection); // actual logic comes here
});

// ...

return (
    <BryntumCalendar
        onSelectionChange={selectionChangeHandler}
        // other properties
    />
)
```
### Using dataChange event to synchronize data

Bryntum Calendar keeps all data in its stores which are automatically synchronized with the UI and the user actions.
Nevertheless, it is sometimes necessary for the rest of the application to be informed about data changes. For that
it is easiest to use `dataChange` event.

```javascript
const App = props => {
    const syncData = ({ store, action, records }) => {
        console.log(`${store.id} changed. The action was: ${action}. Changed records: `, records);
        // Your sync data logic comes here
    }

    return (
        <Scheduler
            {...schedulerConfig}
            onDataChange={syncData}
            ref={schedulerRef}
        />
    )
}
```

You can find details of all events that are fired by `BryntumCalendar` in
the [API documentation](https://bryntum.com/docs/calendar/api/Calendar/view/Calendar#events).

## Features

Features are suffixed with `Feature` and act as both configs and properties for `BryntumCalendarComponent`. They are
mapped to the corresponding API features of the `instance`.

This is a list of all `BryntumCalendar` features:

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

## The native Bryntum Calendar instance

It is important to know that the React component that we may even call "calendar" is _not_ the native Bryntum Calendar
instance, it is a wrapper or an interface between the React application and the Bryntum Calendar itself.

The properties and features are propagated from the wrapper down to the underlying Bryntum Calendar instance but there
might be the situations when you want to access the Bryntum Calendar directly. That is fully valid approach and you are
free to do it.

### Accessing the Bryntum Calendar instance

If you need to access Bryntum Calendar instance, you can do like this:

```javascript
const calendarRef = useRef();

useEffect(()=>{
  // the instance is available as
  console.log(calendarRef.current.instance);
},[])

return <BryntumCalendar ref={calendarRef} {...calendarConfig} />
```

## Using Bryntum Calendar themes

For the scheduler styling you must also import a CSS file that contains a theme for Bryntum Calendar. There are
two main ways of importing the theme.

### Using single theme

The easiest way is to import the CSS file in your `App.js` or in `App.scss`.

In `App.js` you would import **one** of the following:

```javascript
import '@bryntum/calendar/calendar.classic-dark.css';
import '@bryntum/calendar/calendar.classic-light.css';
import '@bryntum/calendar/calendar.classic.css';
import '@bryntum/calendar/calendar.material.css';
import '@bryntum/calendar/calendar.stockholm.css';
```

The syntax is slightly different in `App.scss`; use **one** of the following:

```scss
@import '~@bryntum/calendar/calendar.classic-dark.css';
@import '~@bryntum/calendar/calendar.classic-light.css';
@import '~@bryntum/calendar/calendar.classic.css';
@import '~@bryntum/calendar/calendar.material.css';
@import '~@bryntum/calendar/calendar.stockholm.css';
```

<div class="note">
Importing theme in <b>App.scss</b> file is recommended because this way we keep all styling-related code together in one
file
</div>

### Selecting from multiple themes

Theme switching can be implemented with the help of the `<BryntumThemeCombo />` component. It has to be imported
as any other component before it is used, for example:

```javascript
import { BryntumThemeCombo, } from '@bryntum/scheduler-react';

// ... other code

return (
    // ... other components
    <BryntumThemeCombo />
    // ... other components
);

```

CSS and fonts files that contain themes must be accessible by the server in any subdirectory of the public server
root in `themes` and `themes/fonts`. The easiest way of putting them there is to copy the files automatically during
`postinstall` process in `package.json`:

```json
  "scripts": {
    "postinstall": "postinstall"
  },
  "postinstall": {
    "node_modules/@bryntum/calendar/*.css": "copy public/themes/",
    "node_modules/@bryntum/calendar/fonts": "copy public/themes/fonts"
  },
  "devDependencies": {
    "postinstall": "~0.7.0"
  }
},
```

<div class="note">
Use <b>npm install --save-dev postinstall</b> to install the required <b>postinstall</b> package or add it manually to
<b>package.json</b>
</div>

The last part is to add the default theme link to the head of `public/index.html`:

```html
<head>
  <link
    rel="stylesheet"
  	href="%PUBLIC_URL%/themes/calendar.stockholm.css"
  	data-bryntum-theme
  />
</head>
```

<div class="note">
<b>data-bryntum-theme</b> is mandatory because <b>BryntumThemeCombo</b> relies on it
</div>

<div class="note">
If you adjust location of themes and fonts, adjust it in both <b>package.json</b> and in <b>index.html</b>, for example
<b>my-resources/themes/</b> and <b>my-resources/themes/fonts</b>. No other configuration is needed
</div>

## Loading components dynamically with Next.js

Bryntum components are client-side only, they do not support server-side rendering. Therefore they must be loaded with
`ssr` turned off. Furthermore, the life cycle of dynamically loaded components is different from normal React
components hence the following steps are needed.

The `BryntumCalendar` must be wrapped in another component so that React `refs` will continue to work. To implement it
create a folder outside of Next.js `pages`, for example `components`, and put this extra wrapper there.

Sample code for `components/Calendar.js`:

```javascript
/**
 * A simple wrap around BryntumCalendar for ref to work
 */
import { BryntumCalendar } from '@bryntum/calendar-react';

export default function Calendar({calendarRef, ...props }) {
    return <BryntumCalendar {...props} ref={calendarRef} />
}
```

The above component then can be loaded dynamically with this code:

```javascript
import dynamic from "next/dynamic";
import { useRef } from 'react';

const Calendar = dynamic(
  () => import("../components/Calendar.js"), {ssr: false}
);

const MyComponent = () => {
  const calendarRef = useRef();

  const clickHandler = function(e) {
    // This will log the Bryntum Calendar native instance after it has been loaded
    console.log(calendarRef.current?.instance);
  }

  return (
    <>
      <button onClick={clickHandler}>ref test</button>
      <Calendar
        calendarRef={calendarRef}
        // other props
      />
    </>
```

## CRA performance

CRA scripts by default use `@babel/plugin-transform-runtime` plugin to transpile application's `*.js` library
dependencies. This affects React application performance, which is seriously degraded due to heavy usage of `async`
functions in the Bryntum API.

### Workaround

We offer an updated babel preset `@bryntum/babel-preset-react-app` npm package for CRA scripts to solve this issue.
Patch details can be found inside package `@bryntum/babel-preset-react-app/readme-bryntum.md`.

Add this package alias to your application's `package.json` in `devDependencies`:

```json
  "devDependencies": {
    "babel-preset-react-app": "npm:@bryntum/babel-preset-react-app"
  }
```

Or install with command line:

```shell
npm i --save-dev babel-preset-react-app@npm:@bryntum/babel-preset-react-app
```

Use `browserlist` option to enable most modern browsers babel configuration in app's `package.json`:

```json
     "browserslist": {
       "production": [
         "last 1 chrome version",
         "last 1 firefox version",
         "last 1 safari version"
       ]
     }
```

### CRA references

* [Original CRA scripts](https://github.com/facebook/create-react-app)
* [Alternatives to Ejecting](https://create-react-app.dev/docs/alternatives-to-ejecting)
* Customizing create-react-app: [How to Configure CRA](https://auth0.com/blog/how-to-configure-create-react-app)

## Best practices

There are many possible ways of creating and building React applications ranging from the recommended default way of
using [Create React App](https://create-react-app.dev/) scripts through applications initially created with Create React
App but ejected later, up to very custom setups using Webpack or another packager and manually created application.

We used Create React App to create all our React examples and it has proven to be the simples, most compatible and most
reliable way of using Bryntum Calendar in a React application.

The broad steps are as follows:

* Download the Bryntum Calendar, trial or full version depending on your license
* Use `npx create-react-app bryntum-demo` to create a basic empty React application
* Install `@bryntum/calendar-react` package according to section **Install Bryntum Calendar npm package** above
* Optional: Copy `BryntumCalendar.js` wrapper
* Import and use the `BryntumCalendar` in the application
* Import a Bryntum Calendar CSS file, for example `calendar.stockholm.css` to achieve the proper Bryntum Calendar look

Our examples also use resources from `@bryntum/demo-resources`, for example `example.scss`, fonts and images that are
used to style demo's header, logo, etc. These are generally not needed in your application because you have different
logo, colors, layout of header, etc.

We recommend to use the above procedure and create the application from scratch but if you take our demo as the basis,
do not forget to clean it up from imports, resources, css files and rules that are not needed.

Also we do not recommend to copy the downloaded and unzipped Bryntum Calendar to your project tree not only because it would
bloat the size but mainly because it can fool the IDE to propose auto-imports from the wrong places.

If you decide to copy the files from Bryntum download to your project, always copy selectively only the source files you
need, not the whole distribution.

Please consult Custom Configurations section below if your project has not been created with Create React App.

## Troubleshooting

### Installing, building or running

If you face any issues building or running examples or your application, such issues can be often resolved by the
Project Cleanup procedure which is described in this
[Troubleshooting guide](#Calendar/guides/npm-repository.md#troubleshooting)

### Bryntum bundle included twice

The error `Bundle included twice` usually means that somewhere you have imported both the normal and UMD versions of the
Bryntum Calendar package. Inspect the code and import either UMD or normal version of the Bryntum Calendar but not both.
Bryntum Calendar wrapper uses normal version: `@bryntum/calendar`.

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
* Visit [React Framework Homepage](https://reactjs.org)
* Post your questions to [Bryntum Support Forum](https://bryntum.com/forum/)
* [Contacts us](https://bryntum.com/contact/)


<p class="last-modified">Last modified on 2022-05-30 6:44:29</p>