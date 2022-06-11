[//]: # (Links in this document only works when viewed in the documentation browser, surf to ./docs)

# Bryntum Scheduler

Welcome to the Bryntum Scheduler, a pure JavaScript scheduler component which integrates easily with popular frameworks.
Click a logo below to open the integration guide for the framework:

<div class="framework-logos">
<a href="#Scheduler/guides/integration/react/guide.md"><img src="Core/logo/react.svg" alt="React"><span>React</span></a>
<a href="#Scheduler/guides/integration/angular/guide.md"><img src="Core/logo/angular.svg" alt="Angular"><span>Angular</span></a>
<a href="#Scheduler/guides/integration/vue/guide.md"><img src="Core/logo/vue.svg" alt="Vue"><span>Vue</span></a>
<a href="#Scheduler/guides/integration/ionic.md"><img src="Core/logo/ionic.svg" alt="Ionic"><span>Ionic</span></a>
<a href="#Scheduler/guides/integration/salesforce/readme.md"><img src="Core/logo/salesforce.svg" alt="Salesforce"><span>Salesforce</span></a>
</div>

This document contains very brief info on the Scheduler's structure and how to get started. For more information, please
view the guides and API Docs ([open Scheduler in API docs](#Scheduler/view/Scheduler)).

## Live demo

Here you can try out the Scheduler and some of its main features. For more demos please refer to the example browser.

<div class="external-example" data-file="Scheduler/guides/readme/replaceimage.js"></div>

## Framework agnostic

The Bryntum Scheduler does not require any framework but works perfectly with popular frameworks such as React, Angular,
Vue, Ionic and Ext JS. It also ships with frameworks demos which can be found in the `examples/frameworks` folder.

## Include on your page

Include the distributed bundles using a script tag or as an ES module. Source maps are included so debugging should be a
breeze :) For info on other use cases please view the guides found under /docs.

## Folder structure

The project has the following folders:

| Folder       | Contents                                                                                     |
|--------------|----------------------------------------------------------------------------------------------|
| `/build`     | Distribution folder, contains js bundles, css themes, locales and fonts. More info below.    |
| `/docs`      | Documentation, open it in a browser (needs to be on a web server) to view guides & API docs. |
| `/examples`  | Demos, open it in a browser (needs to be on a web server)                                    |
| `/lib`       | Source code, can be included in your ES6+ project using `import`.                            |
| `/resources` | SCSS files to build our themes or your own custom theme.                                     |
| `/tests`     | Our complete test suite, including Siesta Lite to allow you to run them in a browser.        |

### Using bundles

The bundles are located in `/build`. Bundle files are:

| File                      | Contents                                                            |
|---------------------------|---------------------------------------------------------------------|
| `package.json`            | Importable npm package                                              |
| `scheduler.lite.umd.js`   | UMD-format bundle without transpilation and WebComponents included  |
| `scheduler.module.js`     | ES module bundle for usage with modern browsers or in build process |
| `scheduler.lwc.module.js` | ES module bundle for usage with Lightning Web Components            |
| `scheduler.umd.js`        | Transpiled (babel -> ES5) bundle in UMD-format                      |

All bundles are also available in minified versions, denoted with a `.min.js` file extension.
Typings for TypeScripts can be found in files with a `.d.ts` file extension.

Example inclusion of UMD bundle:

```html
<script type="text/javascript" src="build/scheduler.umd.js"></script>
```

### Using themes

The themes are located in `/build`. Theme files are:

| File                          | Contents            |
|-------------------------------|---------------------|
| `scheduler.classic-dark.css`  | Classic-Dark theme  |
| `scheduler.classic.css`       | Classic theme       |
| `scheduler.classic-light.css` | Classic-Light theme |
| `scheduler.material.css`      | Material theme      |
| `scheduler.stockholm.css`     | Stockholm theme     |

Each theme also exists in a `thin` version that only contains product specific styling (Schedulers full themes include
Scheduler + Grid + all core styling such as buttons etc). For example `scheduler.stockholm.thin.css`. These are intended
for when you include multiple Bryntum products on the same page, to avoid loading shared styling multiple times.

All themes are also available in minified versions, denoted with a `.min.css` file extension.

Example inclusion of Classic-Light theme:

```html
<link rel="stylesheet" href="build/scheduler.classic-light.css" data-bryntum-theme>
```

### Basic usage

How to create a simple scheduler (when using umd bundle) with a few resources and events:

```javascript
var scheduler = new bryntum.scheduler.Scheduler({
    appendTo: document.body,
    height: 400,

    columns: [
        { text: 'Name', field: 'name', width: 160 }
    ],

    resources: [
        { id: 1, name: 'Dan Stevenson' },
        { id: 2, name: 'Talisha Babin' }
    ],

    events: [
        // the date format used is configurable, defaults to the simplified ISO format (e.g. 2017-10-05T14:48:00.000Z)
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toISOString
        { resourceId: 1, startDate: '2017-01-01', endDate: '2017-01-10' },
        { resourceId: 2, startDate: '2017-01-02', endDate: '2017-01-09' }
    ],

    startDate  : new Date(2017, 0, 1),
    endDate    : new Date(2017, 0, 10)
});
```

<div class="external-example" data-file="Scheduler/guides/readme/basic.js"></div>

## Some good to know details

### Code and technologies

* The scheduler is written in ECMAScript 2020 using modules. The modules are built into a bundle (as mentioned above)
  using WebPack + Babel. These bundles work in all supported browsers (Chrome, Firefox, Safari and modern Edge).
* The scheduler is internally styled using SASS. During the build it generates CSS themes from the SASS files. In most
  cases you include one of the themes in your app. For more details on styling, see the guides under guides/styling.

### Scheduler class structure

* The scheduler is based on Bryntum Grid, most features and options for the Grid applies to the Scheduler too. In a
  normal setup you use frozen grid columns to the left and let the scheduler occupy the rest of the available space.
* For performance reasons scheduled event elements are reused when scrolling, meaning that you should never manipulate
  such DOM elements directly (do it from eventRenderers etc. instead).

### External dependencies

Bryntum Scheduler has very few external dependencies, you can see our current dependencies in the licenses.md file

## Copyright and license

Copyright © 2009 - {{YEAR}}, Bryntum

All rights reserved.

[License](https://www.bryntum.com/products/scheduler/license/)


<p class="last-modified">Last modified on 2022-05-30 6:39:04</p>